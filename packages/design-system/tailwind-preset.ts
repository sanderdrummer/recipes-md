import type { Config } from "tailwindcss";
import { tokens } from "./src/tokens";

// Shared Tailwind preset owning the design system's theme. Apps extend it via
// `presets: [preset]` and add the package source to their `content` globs so the
// components' classes survive purging.
const preset = {
  content: [],
  theme: {
    extend: {
      colors: {
        brand: tokens.colors.brand,
        ink: tokens.colors.ink,
      },
    },
  },
} satisfies Config;

export default preset;
