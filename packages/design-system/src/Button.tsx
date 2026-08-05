import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  // "primary" is the neon accent fill; "secondary" is a flat bordered button
  // for supporting actions, keeping the neon reserved for the main action.
  variant?: "primary" | "secondary";
}

const variants = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent",
  secondary:
    "border border-border bg-surface text-text hover:border-accent hover:text-accent focus-visible:ring-accent",
} as const;

// Flat action button; neon accent fill (primary) or bordered (secondary).
export function Button({
  children,
  className,
  type,
  variant = "primary",
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type ?? "button"}
      className={cn(
        "rounded-lg px-4 py-2 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}
