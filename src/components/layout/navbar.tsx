"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { navLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

/**
 * Sticky navigation. Turns to a subtle glass panel after scrolling.
 * The "Order Now" CTA is ALWAYS visible (desktop and mobile) per the brief.
 * Full link list collapses into a mobile menu on small screens.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-paper/10 bg-ink/70 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-base tracking-tight text-paper sm:text-lg"
        >
          {siteConfig.publisher}
        </Link>

        {/* desktop links */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks
            .filter((l) => l.href !== "/")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm text-paper/70 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/account"
            className="hidden font-body text-sm text-paper/70 transition-colors hover:text-gold sm:block"
          >
            Dashboard
          </Link>
          <Button href="/order" size="md" className="shrink-0">
            Order Now
          </Button>
          {/* mobile menu toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-paper/15 text-paper lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {/* mobile menu panel */}
      {open && (
        <div className="border-t border-paper/10 bg-ink/95 backdrop-blur-xl lg:hidden">
          <Container className="grid gap-1 py-4">
            {navLinks
              .filter((l) => l.href !== "/")
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-3 font-body text-sm text-paper/80 transition-colors hover:bg-paper/5 hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
          </Container>
        </div>
      )}
    </header>
  );
}
