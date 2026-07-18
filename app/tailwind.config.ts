import preset from "@recipes-md/design-system/tailwind-preset";
import type { Config } from "tailwindcss";

export default {
  presets: [preset],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    // Scan the design system source so its component classes survive purging.
    "../packages/design-system/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
