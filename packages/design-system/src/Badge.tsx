import type { ReactNode } from "react";
import { cn } from "./cn";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

// Small pill for tags and labels.
export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-800",
        className,
      )}
    >
      {children}
    </span>
  );
}
