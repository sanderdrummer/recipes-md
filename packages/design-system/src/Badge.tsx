import type { ReactNode } from "react";
import { cn } from "./cn";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

// Small pill for tags and labels, flat neon-magenta.
export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full border border-neon-magenta bg-neon-magenta/15 px-2 py-0.5 text-xs font-medium text-neon-magenta",
        className,
      )}
    >
      {children}
    </span>
  );
}
