import type { ReactNode } from "react";
import { cn } from "./cn";

type HeadingLevel = 1 | 2 | 3;

const HEADING_STYLES: Record<HeadingLevel, string> = {
  1: "text-3xl font-bold text-ink-800",
  2: "text-xl font-semibold text-brand-800",
  3: "text-lg font-semibold text-ink-800",
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
    <p className={cn(muted ? "text-ink-500" : "text-ink-600", className)}>
      {children}
    </p>
  );
}
