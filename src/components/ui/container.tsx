import * as React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Consistent horizontal gutters + max width for every section.
 * Keeps the whole site on one spacing rhythm instead of ad-hoc padding.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-shell px-gutter", className)}>
      {children}
    </div>
  );
}
