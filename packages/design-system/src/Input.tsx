import type { InputHTMLAttributes } from "react";
import { cn } from "./cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

// Text/search input styled with the brand focus ring.
export function Input({ className, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      className={cn(
        "w-full rounded-lg border border-brand-300 bg-white px-4 py-2 text-base shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200",
        className,
      )}
    />
  );
}
