"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Cinematic loading screen: black canvas, the book's opening provocation
 * fades in, then the whole layer lifts away to reveal the site.
 * Shows once per session. Reduced-motion users skip straight through.
 */
export function LoadingScreen() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) {
      setDone(true);
      return;
    }
    if (typeof window !== "undefined" && sessionStorage.getItem("ti_intro_seen")) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => {
      setDone(true);
      try {
        sessionStorage.setItem("ti_intro_seen", "1");
      } catch {}
    }, 3200);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-ink"
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.p
            className="max-w-prose px-gutter text-center font-display text-2xl italic leading-snug text-paper/90 sm:text-3xl"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.4, delay: 0.4 }}
          >
            &ldquo;Everything you believe is about to be questioned.&rdquo;
          </motion.p>
          <motion.div
            className="absolute bottom-16 h-px w-24 origin-left bg-gold"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.6, delay: 0.6 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
