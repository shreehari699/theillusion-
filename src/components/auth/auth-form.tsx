"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { signIn, signUp } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

/**
 * Combined sign in / sign up card. Email + password only (fast to launch).
 * Server actions handle the auth; errors surface inline.
 */
export function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const action = mode === "signin" ? signIn : signUp;
      const result = await action(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md rounded-2xl border border-paper/10 bg-ink-soft/60 p-8 backdrop-blur-xl"
    >
      <p className="mb-1 text-center font-body text-xs uppercase tracking-[0.3em] text-gold">
        {siteConfig.name}
      </p>
      <h1 className="mb-6 text-center font-display text-3xl font-bold text-paper">
        {mode === "signin" ? "Welcome back" : "Create your account"}
      </h1>

      {/* tab switch */}
      <div className="mb-6 grid grid-cols-2 rounded-full border border-paper/10 p-1">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`rounded-full py-2 text-sm font-medium transition-colors ${
              mode === m ? "bg-gold text-ink" : "text-paper/60 hover:text-paper"
            }`}
          >
            {m === "signin" ? "Sign in" : "Sign up"}
          </button>
        ))}
      </div>

      <form action={onSubmit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label htmlFor="fullName" className="mb-1 block text-xs uppercase tracking-wider text-paper/50">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              className="w-full rounded-lg border border-paper/15 bg-ink px-4 py-3 text-paper placeholder-paper/30 focus:border-gold focus:outline-none"
              placeholder="Your name"
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-1 block text-xs uppercase tracking-wider text-paper/50">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-paper/15 bg-ink px-4 py-3 text-paper placeholder-paper/30 focus:border-gold focus:outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-xs uppercase tracking-wider text-paper/50">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="w-full rounded-lg border border-paper/15 bg-ink px-4 py-3 text-paper placeholder-paper/30 focus:border-gold focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={pending}
        >
          {pending ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </Button>
      </form>
    </motion.div>
  );
}
