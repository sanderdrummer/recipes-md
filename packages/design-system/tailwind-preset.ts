import type { Config } from "tailwindcss";
import { colorRoles } from "./src/tokens";

// Shared Tailwind preset owning the design system's theme. Apps extend it via
// `presets: [preset]` and add the package source to their `content` globs so the
// components' classes survive purging.
//
// `theme.colors` is OVERRIDDEN (not extended): only `transparent`, `current`, and
// the semantic roles exist, so raw Tailwind color classes (bg-white, bg-red-500,
// brand-700) never generate. Each role resolves to its CSS variable from theme.css,
// with `<alpha-value>` preserving opacity modifiers (bg-surface/80).
const semanticColors = Object.fromEntries(
  colorRoles.map((role) => [role, `rgb(var(--color-${role}) / <alpha-value>)`]),
);

const preset = {
  content: [],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      ...semanticColors,
    },
  },
} satisfies Config;

export default preset;
