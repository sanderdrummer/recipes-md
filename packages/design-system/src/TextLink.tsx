import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

// Underlined inline link in the neon accent colour.
export function TextLink({ children, className, ...rest }: TextLinkProps) {
  return (
    <a
      {...rest}
      className={cn("text-accent underline hover:text-neon-magenta", className)}
    >
      {children}
    </a>
  );
}
