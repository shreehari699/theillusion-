"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Doors } from "./doors";
import { siteConfig } from "@/config/site";

/**
 * The 3D book is loaded dynamically with SSR disabled: WebGL only runs in the
 * browser, and this keeps the heavy Three.js bundle out of the initial page
 * load (performance — "premium means fast"). A flat cover shows while it loads.
 */
const Book3D = dynamic(
  () => import("./book-3d").then((m) => m.Book3D),
  {
    ssr: false,
    loading: () => (
      // eslint-disable-next-line @next/next/no-img-element
      <div className="grid h-full place-items-center">
        <img
          src="/images/cover.jpg"
          alt="THE ILLUSION book cover"
          className="max-h-[60vh] rounded-sm opacity-80 shadow-2xl"
        />
      </div>
    ),
  }
);

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28">
      {/* ambient gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/4 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-gold/5 blur-[120px]"
      />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* left: words */}
          <div className="text-center lg:text-left">
            <motion.p
              className="mb-5 font-body text-xs uppercase tracking-[0.3em] text-gold"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {siteConfig.tagline}
            </motion.p>

            <motion.h1
              className="text-balance font-display text-display-xl font-bold text-paper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.35 }}
            >
              {siteConfig.name}
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-prose text-balance font-body text-lg leading-relaxed text-paper/70 lg:mx-0"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
            >
              {siteConfig.description}
            </motion.p>

            <motion.div
              className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:items-start lg:justify-start sm:justify-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.65 }}
            >
              <Button href="/order" size="lg">
                Order Now
              </Button>
              <Button href="#different" size="lg" variant="ghost">
                Why It&apos;s Different
              </Button>
            </motion.div>
          </div>

          {/* right: the 3D book */}
          <motion.div
            className="h-[52vh] min-h-[380px] w-full lg:h-[70vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          >
            <Book3D />
          </motion.div>
        </div>

        {/* the doors experience sits directly beneath the hero */}
        <div className="py-section" id="enter">
          <Doors />
        </div>
      </Container>
    </section>
  );
}
