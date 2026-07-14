"use client";

import { useState, useTransition } from "react";
import { Container } from "@/components/ui/container";
import { bookConfig } from "@/config/site";
import { ORDER_STATUS_LABELS } from "@/lib/orders";
import { updateOrderStatus, togglePrinted, getScreenshotUrl } from "@/lib/admin-actions";
import {
  Package, IndianRupee, Clock, CheckCircle, Truck, Users, Printer, Eye, MessageCircle,
} from "lucide-react";

/**
 * Build a pre-filled WhatsApp link for an order. Opens WhatsApp (app or web)
 * with the customer's number and a ready-to-send message — you just tap send.
 * Uses wa.me (free, no API needed). Phone is normalized to include +91.
 */
function buildWhatsAppLink(order: {
  full_name: string; phone: string; order_code: string; quantity: number; total_price: number;
}): string {
  // strip spaces/dashes; if 10 digits, prefix India code 91
  let digits = order.phone.replace(/[^0-9]/g, "");
  if (digits.length === 10) digits = "91" + digits;
  const msg =
    `Hello ${order.full_name} 🙏\n\n` +
    `Thank you for ordering THE ILLUSION — A Book with Two Beginnings.\n\n` +
    `📦 Order ID: ${order.order_code}\n` +
    `📖 Quantity: ${order.quantity}\n` +
    `💰 Amount: ₹${order.total_price}\n\n` +
    `To confirm your order, please:\n` +
    `1️⃣ Pay ₹${order.total_price} to UPI ID: ${bookConfig.upiId}\n` +
    `2️⃣ Send a screenshot of your payment here on WhatsApp\n\n` +
    `Once I verify your payment, your copy will be prepared and shipped to your address 📮\n\n` +
    `Thank you for supporting independent publishing 🖤\n` +
    `— Shree Hari, Zero Degree Publications`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}

interface Order {
  id: string;
  order_code: string;
  full_name: string;
  email: string;
  phone: string;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  quantity: number;
  total_price: number;
  payment_method: string;
  payment_screenshot_path: string | null;
  status: string;
  printed: boolean;
  created_at: string;
}

const STATUSES = [
  "PENDING_VERIFICATION", "PAID", "RESERVED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED",
];

export function AdminDashboard({ orders }: { orders: Order[] }) {
  const [pending, startTransition] = useTransition();
  const [viewing, setViewing] = useState<string | null>(null);

  // ── stats ──
  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => ["PAID", "PACKED", "SHIPPED", "DELIVERED"].includes(o.status)).length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING_VERIFICATION").length;
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;
  const pickupOrders = orders.filter((o) => o.payment_method === "PICKUP").length;
  const revenue = orders
    .filter((o) => ["PAID", "PACKED", "SHIPPED", "DELIVERED"].includes(o.status))
    .reduce((sum, o) => sum + o.total_price, 0);

  // ── print management ──
  const booksRequired = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.quantity, 0);
  const printed = orders
    .filter((o) => o.printed && o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.quantity, 0);
  const remaining = booksRequired - printed;

  function changeStatus(id: string, status: string) {
    startTransition(() => {
      void updateOrderStatus(id, status);
    });
  }
  function markPrinted(id: string, val: boolean) {
    startTransition(() => {
      void togglePrinted(id, val);
    });
  }
  async function viewScreenshot(path: string) {
    setViewing("loading");
    const res = await getScreenshotUrl(path);
    if (res.url) {
      window.open(res.url, "_blank");
      setViewing(null);
    } else {
      alert(res.error ?? "Could not load screenshot");
      setViewing(null);
    }
  }

  return (
    <Container className="pb-section">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Admin</p>
      <h1 className="mt-1 font-display text-3xl text-paper">Dashboard</h1>

      {/* overview cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Stat icon={Package} label="Total orders" value={totalOrders} />
        <Stat icon={IndianRupee} label="Revenue" value={`${bookConfig.currencySymbol}${revenue}`} />
        <Stat icon={CheckCircle} label="Paid" value={paidOrders} />
        <Stat icon={Clock} label="Pending" value={pendingOrders} />
        <Stat icon={Truck} label="Delivered" value={deliveredOrders} />
        <Stat icon={Users} label="Pickup" value={pickupOrders} />
      </div>

      {/* print management */}
      <div className="mt-8 rounded-2xl border border-gold/20 bg-gold/5 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Printer className="h-5 w-5 text-gold" />
          <h2 className="font-display text-xl text-paper">Print management</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <PrintStat label="Books required" value={booksRequired} />
          <PrintStat label="Printed" value={printed} />
          <PrintStat label="Remaining to print" value={remaining} highlight />
        </div>
      </div>

      {/* orders table */}
      <h2 className="mt-10 mb-4 font-display text-xl text-paper">Orders</h2>
      {orders.length === 0 ? (
        <p className="rounded-2xl border border-paper/10 bg-ink-soft/40 p-10 text-center text-paper/50">
          No orders yet.
        </p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-paper/10 bg-ink-soft/40 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg text-paper">{o.order_code}</span>
                    {o.printed && (
                      <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] uppercase text-green-300">
                        printed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-paper/70">{o.full_name} · {o.phone}</p>
                  {o.address && (
                    <p className="mt-1 text-xs text-paper/40">
                      {o.address}, {o.city}, {o.state} — {o.pincode}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-paper/40">
                    Qty {o.quantity} · {bookConfig.currencySymbol}{o.total_price} · {o.payment_method}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* message customer on WhatsApp (pre-filled) */}
                  <a
                    href={buildWhatsAppLink(o)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-green-500/30 px-3 py-2 text-xs text-green-300 hover:border-green-400 hover:bg-green-500/10"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                  {/* view screenshot */}
                  {o.payment_screenshot_path && (
                    <button
                      onClick={() => viewScreenshot(o.payment_screenshot_path!)}
                      disabled={viewing === "loading"}
                      className="inline-flex items-center gap-1 rounded-lg border border-paper/20 px-3 py-2 text-xs text-paper hover:border-gold"
                    >
                      <Eye className="h-3.5 w-3.5" /> Proof
                    </button>
                  )}
                  {/* status select */}
                  <select
                    value={o.status}
                    disabled={pending}
                    onChange={(e) => changeStatus(o.id, e.target.value)}
                    className="rounded-lg border border-paper/20 bg-ink px-3 py-2 text-xs text-paper focus:border-gold focus:outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                  {/* printed toggle */}
                  <button
                    onClick={() => markPrinted(o.id, !o.printed)}
                    disabled={pending}
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs transition-colors ${
                      o.printed
                        ? "border border-green-500/30 text-green-300"
                        : "border border-paper/20 text-paper hover:border-gold"
                    }`}
                  >
                    <Printer className="h-3.5 w-3.5" />
                    {o.printed ? "Printed" : "Mark printed"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-paper/10 bg-ink-soft/40 p-4">
      <Icon className="mb-2 h-5 w-5 text-gold" strokeWidth={1.4} />
      <p className="font-display text-2xl text-paper">{value}</p>
      <p className="text-xs text-paper/50">{label}</p>
    </div>
  );
}

function PrintStat({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div>
      <p className={`font-display text-3xl ${highlight ? "text-gold" : "text-paper"}`}>{value}</p>
      <p className="text-xs text-paper/50">{label}</p>
    </div>
  );
}
