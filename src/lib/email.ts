import { Resend } from "resend";
import { bookConfig, siteConfig } from "@/config/site";

/**
 * Email notifications via Resend. Two emails per order:
 *  1) Customer confirmation (their order summary)
 *  2) Admin alert to you (new order details)
 *
 * Env vars needed:
 *  RESEND_API_KEY   — from resend.com
 *  ADMIN_EMAIL      — where YOU get new-order alerts
 *  EMAIL_FROM       — sender address (default: onboarding@resend.dev for testing)
 *
 * Fails safe: if email isn't configured or errors, we log and continue —
 * an email problem must NEVER block an order from being saved.
 */

interface OrderEmailData {
  orderCode: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  quantity: number;
  totalPrice: number;
  paymentMethod: string;
}

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const FROM = process.env.EMAIL_FROM || "THE ILLUSION <onboarding@resend.dev>";

export async function sendOrderEmails(order: OrderEmailData): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping emails.");
    return;
  }

  const addressBlock = order.address
    ? `${order.address}, ${order.city}, ${order.state} — ${order.pincode}`
    : "Pickup order";

  // 1) Customer confirmation
  try {
    await resend.emails.send({
      from: FROM,
      to: order.email,
      subject: `Your order ${order.orderCode} — ${siteConfig.name}`,
      html: customerHtml(order, addressBlock),
    });
  } catch (e) {
    console.error("Customer email failed:", e);
  }

  // 2) Admin alert to you
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    try {
      await resend.emails.send({
        from: FROM,
        to: adminEmail,
        subject: `🔔 New order ${order.orderCode} — ₹${order.totalPrice}`,
        html: adminHtml(order, addressBlock),
      });
    } catch (e) {
      console.error("Admin email failed:", e);
    }
  }
}

function customerHtml(o: OrderEmailData, address: string): string {
  return `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;background:#0B0B0B;color:#F8F8F6;padding:40px 32px;border-radius:12px">
    <p style="color:#D4AF37;letter-spacing:3px;font-size:12px;text-transform:uppercase;margin:0">${siteConfig.tagline}</p>
    <h1 style="font-size:28px;margin:8px 0 4px">${siteConfig.name}</h1>
    <p style="color:#bbb;margin:0 0 24px">Thank you, ${o.fullName}. Your order is received.</p>
    <div style="background:#141414;border:1px solid #2a2a2a;border-radius:10px;padding:20px;margin-bottom:20px">
      <table style="width:100%;font-family:Arial,sans-serif;font-size:14px;color:#ddd">
        <tr><td style="color:#888;padding:4px 0">Order ID</td><td style="text-align:right">${o.orderCode}</td></tr>
        <tr><td style="color:#888;padding:4px 0">Quantity</td><td style="text-align:right">${o.quantity}</td></tr>
        <tr><td style="color:#888;padding:4px 0">Delivery</td><td style="text-align:right">${o.paymentMethod === "UPI" ? "Home delivery" : "Pickup"}</td></tr>
        <tr><td style="color:#888;padding:4px 0">Address</td><td style="text-align:right">${address}</td></tr>
        <tr><td style="color:#D4AF37;padding:12px 0 0;font-size:16px">Total</td><td style="text-align:right;color:#D4AF37;font-size:16px;padding-top:12px">₹${o.totalPrice}</td></tr>
      </table>
    </div>
    <p style="color:#bbb;font-family:Arial,sans-serif;font-size:14px;line-height:1.6">
      ${o.paymentMethod === "UPI"
        ? `We'll verify your payment and confirm shortly. If you haven't paid yet, send ₹${o.totalPrice} to <strong style="color:#D4AF37">${bookConfig.upiId}</strong>.`
        : `Your copy is reserved. We'll be in touch to arrange pickup.`}
    </p>
    <p style="color:#666;font-family:Arial,sans-serif;font-size:12px;margin-top:24px">— ${siteConfig.author}, ${siteConfig.publisher}</p>
  </div>`;
}

function adminHtml(o: OrderEmailData, address: string): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
    <h2>🔔 New Order: ${o.orderCode}</h2>
    <table style="width:100%;font-size:14px;border-collapse:collapse">
      <tr><td style="padding:6px;background:#f5f5f5"><b>Name</b></td><td style="padding:6px">${o.fullName}</td></tr>
      <tr><td style="padding:6px;background:#f5f5f5"><b>Phone</b></td><td style="padding:6px">${o.phone}</td></tr>
      <tr><td style="padding:6px;background:#f5f5f5"><b>Email</b></td><td style="padding:6px">${o.email}</td></tr>
      <tr><td style="padding:6px;background:#f5f5f5"><b>Address</b></td><td style="padding:6px">${address}</td></tr>
      <tr><td style="padding:6px;background:#f5f5f5"><b>Quantity</b></td><td style="padding:6px">${o.quantity}</td></tr>
      <tr><td style="padding:6px;background:#f5f5f5"><b>Total</b></td><td style="padding:6px">₹${o.totalPrice}</td></tr>
      <tr><td style="padding:6px;background:#f5f5f5"><b>Method</b></td><td style="padding:6px">${o.paymentMethod}</td></tr>
    </table>
    <p style="color:#888;font-size:13px">Check your admin dashboard to verify payment and update status.</p>
  </div>`;
}
