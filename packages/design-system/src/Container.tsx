import type { ReactNode } from "react";
import { cn } from "./cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

// Centred page column. Vertical padding is passed via `className` (e.g. "py-6").
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto max-w-3xl px-4", className)}>{children}</div>
  );
}
