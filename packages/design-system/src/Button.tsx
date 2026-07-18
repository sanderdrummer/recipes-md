import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

// Primary action button in the brand accent colour.
export function Button({ children, className, type, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      type={type ?? "button"}
      className={cn(
        "rounded-lg bg-brand-700 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-200",
        className,
      )}
    >
      {children}
    </button>
  );
}
