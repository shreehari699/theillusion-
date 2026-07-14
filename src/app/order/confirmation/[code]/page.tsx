import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { bookConfig, siteConfig } from "@/config/site";
import { ORDER_STATUS_LABELS } from "@/lib/orders";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = { title: "Order confirmed" };

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("order_code", code)
    .maybeSingle();

  // Graceful fallback: if the order can't be read right now (timing/session),
  // still show a success message with the order code rather than a blank page.
  if (!order) {
    return (
      <>
        <Navbar />
        <main className="grid min-h-dvh place-items-center pt-24">
          <Container className="max-w-xl pb-section text-center">
            <CheckCircle2 className="mx-auto mb-5 h-14 w-14 text-gold" strokeWidth={1.2} />
            <h1 className="font-display text-display-md font-bold text-paper">
              Order received
            </h1>
            <p className="mx-auto mt-4 max-w-prose text-paper/70">
              Your order <span className="text-gold">{code}</span> has been placed.
              You can see it any time in your dashboard.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button href="/account">Go to dashboard</Button>
              <Button href="/order" variant="ghost">Order another copy</Button>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="grid min-h-dvh place-items-center pt-24">
        <Container className="max-w-xl pb-section text-center">
          <CheckCircle2 className="mx-auto mb-5 h-14 w-14 text-gold" strokeWidth={1.2} />
          <h1 className="font-display text-display-md font-bold text-paper">
            {order.payment_method === "UPI" ? "Order received" : "Copy reserved"}
          </h1>
          <p className="mx-auto mt-4 max-w-prose text-paper/70">
            {order.payment_method === "UPI"
              ? `Thank you. ${siteConfig.author} will verify your payment and confirm your order shortly.`
              : "Your copy is held. We'll reach out to arrange pickup and payment."}
          </p>

          <div className="mt-8 rounded-2xl border border-paper/10 bg-ink-soft/60 p-6 text-left">
            <Row label="Order ID" value={order.order_code} />
            <Row label="Name" value={order.full_name} />
            <Row label="Method" value={order.payment_method === "UPI" ? "Home delivery" : "Pickup"} />
            <Row label="Status" value={ORDER_STATUS_LABELS[order.status] ?? order.status} bold />
            <div className="my-4 h-px bg-paper/10" />
            <Row label="Total" value={`${bookConfig.currencySymbol}${order.total_price}`} bold />
          </div>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button href="/account">Track in dashboard</Button>
            <Button href="/order" variant="ghost">Order another copy</Button>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs uppercase tracking-wider text-paper/50">{label}</span>
      <span className={bold ? "font-display text-base text-gold" : "text-sm text-paper"}>{value}</span>
    </div>
  );
}
