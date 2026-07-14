import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-actions";
import { bookConfig } from "@/config/site";
import { ORDER_STATUS_LABELS } from "@/lib/orders";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const name = (auth.user.user_metadata?.full_name as string) ?? auth.user.email;

  return (
    <>
      <Navbar />
      <main className="min-h-dvh pt-24">
        <Container className="max-w-3xl pb-section">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">My account</p>
              <h1 className="mt-1 font-display text-3xl text-paper">{name}</h1>
            </div>
            <form action={signOut}>
              <Button type="submit" variant="ghost">Sign out</Button>
            </form>
          </div>

          <h2 className="mb-4 font-display text-xl text-paper">Your orders</h2>

          {!orders || orders.length === 0 ? (
            <div className="rounded-2xl border border-paper/10 bg-ink-soft/40 p-10 text-center">
              <p className="text-paper/60">You haven&apos;t placed an order yet.</p>
              <Button href="/order" className="mt-5">Order THE ILLUSION</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="rounded-2xl border border-paper/10 bg-ink-soft/40 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display text-lg text-paper">{o.order_code}</p>
                      <p className="text-xs text-paper/50">
                        {new Date(o.created_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                    <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
                      {ORDER_STATUS_LABELS[o.status] ?? o.status}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-paper/60">
                      Qty {o.quantity} · {o.payment_method === "UPI" ? "Delivery" : "Pickup"}
                    </span>
                    <span className="font-display text-gold">
                      {bookConfig.currencySymbol}{o.total_price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
