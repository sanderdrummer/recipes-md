import { cn } from "./cn";
import { useTheme } from "./theme";

interface ThemeToggleProps {
  className?: string;
}

// Toggles between dark and light. Shows the icon of the theme it will switch to.
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        isDark ? "Zu hellem Design wechseln" : "Zu dunklem Design wechseln"
      }
      className={cn(
        "rounded-lg border border-border px-2 py-1 text-text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
}
