import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely — clsx handles conditionals,
 * twMerge resolves conflicts (e.g. "px-2 px-4" -> "px-4").
 * Used by every UI component so class overrides behave predictably.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
