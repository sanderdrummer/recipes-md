import type { TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

// Multi-line text input styled to match Input, with the neon accent focus ring.
export function Textarea({ className, ...rest }: TextareaProps) {
  return (
    <textarea
      {...rest}
      className={cn(
        "w-full min-h-24 resize-y rounded-lg border border-border bg-surface px-4 py-2 text-base text-text placeholder:text-text-muted focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
    />
  );
}
