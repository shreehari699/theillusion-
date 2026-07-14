"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Verify the current user is an admin (email in the admins table). */
async function assertAdmin() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false as const, error: "Not signed in." };

  const { data: admin } = await supabase
    .from("admins")
    .select("email")
    .eq("email", auth.user.email)
    .maybeSingle();

  if (!admin) return { ok: false as const, error: "Not authorized." };
  return { ok: true as const, supabase };
}

/** Update an order's status (admin only). */
export async function updateOrderStatus(orderId: string, status: string) {
  const gate = await assertAdmin();
  if (!gate.ok) return { error: gate.error };

  const { error } = await gate.supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

/** Toggle whether an order's book has been printed (admin only). */
export async function togglePrinted(orderId: string, printed: boolean) {
  const gate = await assertAdmin();
  if (!gate.ok) return { error: gate.error };

  const { error } = await gate.supabase
    .from("orders")
    .update({ printed })
    .eq("id", orderId);

  if (error) return { error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

/** Get a signed URL to view a payment screenshot (admin only). */
export async function getScreenshotUrl(path: string) {
  const gate = await assertAdmin();
  if (!gate.ok) return { error: gate.error };

  const { data, error } = await gate.supabase.storage
    .from("payment-proofs")
    .createSignedUrl(path, 60 * 10); // valid 10 min

  if (error) return { error: error.message };
  return { url: data.signedUrl };
}
