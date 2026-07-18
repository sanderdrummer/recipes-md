import { useCallback, useEffect, useState } from "react";
import type { ThemeName } from "./tokens";

const STORAGE_KEY = "theme";

function readStored(): ThemeName | null {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "dark" || value === "light" ? value : null;
}

// Resolve the initial theme: stored preference wins, else prefers-color-scheme,
// defaulting to dark when the user has no light preference.
function resolveInitial(): ThemeName {
  const stored = readStored();
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function apply(theme: ThemeName): void {
  document.documentElement.dataset.theme = theme;
}

// Read the active theme, and toggle it (persisting to localStorage + document root).
export function useTheme(): { theme: ThemeName; toggle: () => void } {
  const [theme, setTheme] = useState<ThemeName>(resolveInitial);

  useEffect(() => {
    apply(theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: ThemeName = current === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
