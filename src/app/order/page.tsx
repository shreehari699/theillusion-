import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { OrderFlow } from "@/components/order/order-flow";

export const metadata: Metadata = { title: "Order" };

export default async function OrderPage() {
  // must be logged in to order
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  return (
    <>
      <Navbar />
      <main className="min-h-dvh pt-24">
        <OrderFlow
          userEmail={data.user.email ?? ""}
          userName={(data.user.user_metadata?.full_name as string) ?? ""}
        />
      </main>
      <Footer />
    </>
  );
}
