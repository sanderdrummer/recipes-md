import { useCallback, useEffect, useState } from "react";
import { type ThemeName, themes } from "./tokens";

const STORAGE_KEY = "theme";

// Cycle order of the toggle.
const successor: Record<ThemeName, ThemeName> = {
  dark: "light",
  light: "cozy",
  cozy: "dark",
};

function readStored(): ThemeName | null {
  const value = localStorage.getItem(STORAGE_KEY);
  return value !== null && value in themes ? (value as ThemeName) : null;
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

export function nextTheme(current: ThemeName): ThemeName {
  return successor[current];
}

// Read the active theme, and cycle through all themes (persisting to
// localStorage + document root).
export function useTheme(): { theme: ThemeName; toggle: () => void } {
  const [theme, setTheme] = useState<ThemeName>(resolveInitial);

  useEffect(() => {
    apply(theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = nextTheme(current);
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
