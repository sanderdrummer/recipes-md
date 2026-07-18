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
    "block rounded-lg border border-brand-200 bg-white p-4 shadow-sm",
    href !== undefined && "transition hover:border-brand-400 hover:shadow-md",
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
