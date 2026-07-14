"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "./section-heading";
import { chapters } from "@/content/book";

/**
 * Animated chapter reveal showing the true tête-bêche architecture:
 * the ILLUSION side, the THRESHOLD + SHARED center, and the REALITY side,
 * visually distinguished. Titles fade/slide in as they scroll into view.
 */
const sideLabel: Record<string, string> = {
  ILLUSION: "The Illusion",
  SHARED: "The Threshold · Shared",
  REALITY: "The Reality",
};

export function Chapters() {
  const reduce = useReducedMotion();

  // group consecutive chapters by side for labeled bands
  const groups: { side: string; items: typeof chapters }[] = [];
  for (const ch of chapters) {
    const last = groups[groups.length - 1];
    if (last && last.side === ch.side) last.items.push(ch);
    else groups.push({ side: ch.side, items: [ch] });
  }

  return (
    <section id="chapters" className="border-y border-paper/10 bg-ink-soft/40 py-section">
      <Container>
        <SectionHeading eyebrow="The chapters" title="Two paths, one center" />

        <div className="mx-auto max-w-2xl space-y-12">
          {groups.map((group, gi) => (
            <div key={gi}>
              <p className="mb-5 text-center font-body text-xs uppercase tracking-[0.3em] text-gold">
                {sideLabel[group.side]}
              </p>
              <ul className="space-y-1">
                {group.items.map((ch, i) => {
                  const isCenter = ch.side === "SHARED" && ch.number === "15";
                  return (
                    <motion.li
                      key={`${ch.number}-${ch.title}`}
                      initial={reduce ? false : { opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className={`group flex items-baseline gap-5 rounded-md px-4 py-3 transition-colors hover:bg-paper/5 ${
                        isCenter ? "bg-gold/10" : ""
                      }`}
                    >
                      <span
                        className={`w-10 shrink-0 font-display text-sm ${
                          isCenter ? "text-gold" : "text-paper/40"
                        }`}
                      >
                        {ch.number}
                      </span>
                      <span
                        className={`font-display text-lg transition-colors ${
                          isCenter
                            ? "text-gold"
                            : "text-paper/85 group-hover:text-paper"
                        }`}
                      >
                        {ch.title}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
