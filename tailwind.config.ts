import type { Config } from "tailwindcss";

/**
 * THE ILLUSION — Design System Tokens
 * Brand direction is LOCKED per the approved blueprint:
 * black + cream, gold accent, Playfair Display (display) + Inter (body).
 * Every value here is the single source of truth so no screen invents its own colors.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0B0B", // primary near-black
          soft: "#141414",
          muted: "#1E1E1E",
        },
        paper: {
          DEFAULT: "#F8F8F6", // warm cream
          dim: "#EDEDE8",
        },
        gold: {
          DEFAULT: "#D4AF37", // accent
          soft: "#E4C766",
          deep: "#A98A28",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // fluid type scale — mobile-first, scales with viewport
        "display-xl": ["clamp(2.75rem, 8vw, 6rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 5vw, 3.75rem)", { lineHeight: "1.06", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.5rem, 3.5vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
      },
      spacing: {
        // consistent rhythm (4px base) — sections use these, never magic numbers
        section: "clamp(4rem, 10vw, 9rem)",
        gutter: "clamp(1.25rem, 5vw, 4rem)",
      },
      maxWidth: {
        prose: "68ch",
        shell: "1200px",
      },
      transitionTimingFunction: {
        // one shared easing so all motion feels like the same hand
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
