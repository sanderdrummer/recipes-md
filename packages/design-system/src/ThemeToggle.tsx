import { cn } from "./cn";
import { nextTheme, useTheme } from "./theme";
import type { ThemeName } from "./tokens";

interface ThemeToggleProps {
  className?: string;
}

// Icon + label of each theme, shown for the theme the button switches TO.
const next: Record<ThemeName, { icon: string; label: string }> = {
  dark: { icon: "☾", label: "Zu dunklem Design wechseln" },
  light: { icon: "☀", label: "Zu hellem Design wechseln" },
  cozy: { icon: "♥", label: "Zu gemütlichem Design wechseln" },
};

// Cycles through dark → light → cozy. Shows the icon of the theme it will switch to.
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const target = next[nextTheme(theme)];
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={target.label}
      className={cn(
        "rounded-lg border border-border px-2 py-1 text-text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span aria-hidden="true">{target.icon}</span>
    </button>
  );
}
