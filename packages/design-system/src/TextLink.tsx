import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

// Underlined inline link in the brand accent colour.
export function TextLink({ children, className, ...rest }: TextLinkProps) {
  return (
    <a {...rest} className={cn("text-brand-700 underline", className)}>
      {children}
    </a>
  );
}
