import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  // if already logged in, skip straight to ordering
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/order");

  return (
    <>
      <Navbar />
      <main className="grid min-h-dvh place-items-center px-gutter pt-24">
        <AuthForm />
      </main>
    </>
  );
}
