import type { ReactNode } from "react";
import { cn } from "./cn";

interface CardProps {
  children: ReactNode;
  // When provided the card renders as a link with hover affordances.
  href?: string;
  className?: string;
}

export function Card({ children, href, className }: CardProps) {
  const classes = cn(
    "block rounded-lg border border-border bg-surface p-4",
    href !== undefined && "transition-colors hover:border-accent",
    className,
  );

  if (href !== undefined) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return <div className={classes}>{children}</div>;
}
