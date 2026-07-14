import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center font-body font-medium tracking-wide " +
  "transition-all duration-300 ease-premium focus-visible:outline-none " +
  "disabled:pointer-events-none disabled:opacity-50 rounded-full";

const variants: Record<Variant, string> = {
  primary: "bg-gold text-ink hover:bg-gold-soft active:scale-[0.98] shadow-[0_0_0_0_rgba(212,175,55,0.0)] hover:shadow-[0_8px_30px_-6px_rgba(212,175,55,0.5)]",
  ghost: "bg-transparent text-paper border border-paper/20 hover:border-gold hover:text-gold",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-9 text-base",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
}

/**
 * One button, used everywhere. If `href` is provided it renders as a link
 * (correct for navigation/CTAs like "Order Now"); otherwise a real <button>.
 */
export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
