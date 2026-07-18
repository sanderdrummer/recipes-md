// Design tokens for the recipes design system.
//
// The palette mirrors the app's original Tailwind amber/stone colours exactly, so
// existing screens render identically. `brand` is the amber accent scale and `ink`
// the neutral (stone) text/surface scale. Consume these either as typed values here
// or through the Tailwind preset's semantic class names (`bg-brand-100`, …).

export const tokens = {
  colors: {
    brand: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
      950: "#451a03",
    },
    ink: {
      50: "#fafaf9",
      100: "#f5f5f4",
      200: "#e7e5e4",
      300: "#d6d3d1",
      400: "#a8a29e",
      500: "#78716c",
      600: "#57534e",
      700: "#44403c",
      800: "#292524",
      900: "#1c1917",
      950: "#0c0a09",
    },
  },
} as const;

export type Tokens = typeof tokens;
