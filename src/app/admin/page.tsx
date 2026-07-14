import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/ui/container";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  // admin gate
  const { data: admin } = await supabase
    .from("admins")
    .select("email")
    .eq("email", auth.user.email)
    .maybeSingle();

  if (!admin) {
    return (
      <>
        <Navbar />
        <main className="grid min-h-dvh place-items-center pt-24">
          <Container className="max-w-md text-center">
            <h1 className="font-display text-2xl text-paper">Not authorized</h1>
            <p className="mt-3 text-paper/60">
              This area is for administrators only.
            </p>
          </Container>
        </main>
      </>
    );
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  // registered users count (via admin — needs service role; simple approx here)
  return (
    <>
      <Navbar />
      <main className="min-h-dvh pt-24">
        <AdminDashboard orders={orders ?? []} />
      </main>
    </>
  );
}
