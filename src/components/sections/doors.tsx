"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { DoorOpen } from "lucide-react";

/**
 * The two-doors signature experience. THE ILLUSION and THE REALITY doors
 * sit side by side; choosing one animates it open and both paths converge
 * (a caption confirms the tête-bêche idea: both lead to the same room).
 * This is the site's signature — the thing no other book site has.
 */
const doors = [
  {
    key: "illusion",
    label: "THE ILLUSION",
    sub: "Enter through the story",
    tint: "from-ink-soft to-ink",
  },
  {
    key: "reality",
    label: "THE REALITY",
    sub: "Enter through the truth",
    tint: "from-ink to-ink-soft",
  },
] as const;

export function Doors() {
  const reduce = useReducedMotion();
  const [chosen, setChosen] = useState<string | null>(null);

  return (
    <div className="relative">
      <div className="grid gap-4 sm:grid-cols-2">
        {doors.map((door) => {
          const isChosen = chosen === door.key;
          const isDimmed = chosen !== null && !isChosen;
          return (
            <motion.button
              key={door.key}
              type="button"
              onClick={() => setChosen(door.key)}
              className={`group relative flex h-72 flex-col items-center justify-center overflow-hidden rounded-lg border border-paper/10 bg-gradient-to-b ${door.tint} px-6 text-center transition-opacity duration-700`}
              animate={{ opacity: isDimmed ? 0.35 : 1 }}
              whileHover={reduce ? undefined : { scale: 1.01 }}
            >
              {/* the "door" leaf that swings open */}
              <motion.span
                className="pointer-events-none absolute inset-0 origin-left bg-gradient-to-r from-black/60 to-transparent"
                animate={
                  isChosen && !reduce
                    ? { rotateY: -95, opacity: 0 }
                    : { rotateY: 0, opacity: 1 }
                }
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                style={{ transformStyle: "preserve-3d" }}
              />
              <DoorOpen
                className="mb-4 h-8 w-8 text-gold transition-transform duration-500 group-hover:-translate-y-1"
                strokeWidth={1.2}
              />
              <span className="font-display text-2xl font-semibold tracking-wide text-paper">
                {door.label}
              </span>
              <span className="mt-2 font-body text-xs uppercase tracking-[0.25em] text-paper/50">
                {door.sub}
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.p
        className="mt-6 text-center font-body text-sm text-paper/60"
        initial={false}
        animate={{ opacity: chosen ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        Both doors lead to the same room. That is the point.
      </motion.p>
    </div>
  );
}
