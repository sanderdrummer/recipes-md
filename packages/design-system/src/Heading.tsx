import type { ReactNode } from "react";
import { cn } from "./cn";

type HeadingLevel = 1 | 2 | 3;

const HEADING_STYLES: Record<HeadingLevel, string> = {
  1: "font-display text-3xl font-bold tracking-tight text-text sm:text-4xl",
  2: "font-display text-xl font-bold tracking-tight text-accent",
  3: "font-display text-lg font-medium text-text",
};

interface HeadingProps {
  level: HeadingLevel;
  children: ReactNode;
  className?: string;
}

export function Heading({ level, children, className }: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag className={cn(HEADING_STYLES[level], className)}>{children}</Tag>;
}

interface TextProps {
  children: ReactNode;
  muted?: boolean;
  className?: string;
}

// Body text. `muted` lightens it for secondary information (counts, empty states).
export function Text({ children, muted, className }: TextProps) {
  return (
    <p className={cn(muted ? "text-text-muted" : "text-text", className)}>
      {children}
    </p>
  );
}
