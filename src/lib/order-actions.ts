"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { bookConfig } from "@/config/site";
import { generateOrderCode } from "@/lib/orders";

export interface OrderResult {
  error?: string;
  orderCode?: string;
}

/**
 * Create an order. For UPI: expects a payment screenshot (uploaded to the
 * private 'payment-proofs' bucket) and marks the order PENDING_VERIFICATION.
 * For PICKUP: no screenshot, marked RESERVED.
 * Security: user must be logged in; order is tied to their user id, and RLS
 * ensures they can only ever create/read their own.
 */
export async function createOrder(formData: FormData): Promise<OrderResult> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "Please sign in to place an order." };

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? auth.user.email ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const pincode = String(formData.get("pincode") ?? "").trim();
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1));
  const paymentMethod = String(formData.get("paymentMethod") ?? "UPI");

  if (!fullName || !phone) {
    return { error: "Name and phone number are required." };
  }
  if (paymentMethod === "UPI" && (!address || !city || !state || !pincode)) {
    return { error: "Delivery address is required for online payment." };
  }

  const unitPrice = bookConfig.price;
  const totalPrice = unitPrice * quantity;

  // Handle screenshot upload for UPI orders
  let screenshotPath: string | null = null;
  if (paymentMethod === "UPI") {
    const file = formData.get("screenshot") as File | null;
    if (!file || file.size === 0) {
      return { error: "Please upload a screenshot of your payment." };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { error: "Screenshot must be under 5MB." };
    }
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${auth.user.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("payment-proofs")
      .upload(path, file, { upsert: true });
    if (upErr) return { error: `Upload failed: ${upErr.message}` };
    screenshotPath = path;
  }

  // Insert the order. Retry with a fresh code up to 3 times in the very
  // unlikely event of an order_code collision, so an order NEVER silently
  // fails to save.
  let orderCode = generateOrderCode();
  let saved = false;
  for (let attempt = 0; attempt < 3 && !saved; attempt++) {
    const { error: insErr } = await supabase.from("orders").insert({
      order_code: orderCode,
      user_id: auth.user.id,
      full_name: fullName,
      email,
      phone,
      address: address || null,
      city: city || null,
      state: state || null,
      pincode: pincode || null,
      quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
      payment_method: paymentMethod,
      payment_screenshot_path: screenshotPath,
      status: paymentMethod === "UPI" ? "PENDING_VERIFICATION" : "RESERVED",
    });

    if (!insErr) {
      saved = true;
    } else if (insErr.code === "23505") {
      // unique violation on order_code — generate a new one and retry
      orderCode = generateOrderCode();
    } else {
      return { error: `Could not save order: ${insErr.message}` };
    }
  }

  if (!saved) {
    return { error: "Could not save order after multiple attempts. Please try again." };
  }

  // Send emails (customer confirmation + admin alert). This must NEVER block
  // or fail the order — it's wrapped so any email error is logged and ignored.
  try {
    const { sendOrderEmails } = await import("@/lib/email");
    await sendOrderEmails({
      orderCode,
      fullName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      quantity,
      totalPrice,
      paymentMethod,
    });
  } catch (e) {
    console.error("Order emails failed (order still saved):", e);
  }

  redirect(`/order/confirmation/${orderCode}`);
}
