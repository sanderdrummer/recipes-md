// Semantic design tokens for the recipes design system.
//
// Color is expressed as ROLES (surface, text, accent, …), never raw scales. Each
// role resolves at runtime to a CSS custom property defined in `theme.css`, so the
// same class name yields the dark (default, cyberpunk) or light value depending on
// the active `data-theme`. Values are stored as space-separated RGB channel triplets
// so Tailwind's opacity modifiers (`bg-surface/80`) keep working via `<alpha-value>`.

// The semantic role names. The Tailwind preset turns each into a utility color.
export const colorRoles = [
  "background",
  "surface",
  "surface-raised",
  "border",
  "text",
  "text-muted",
  "accent",
  "accent-foreground",
  "neon-cyan",
  "neon-magenta",
] as const;

export type ColorRole = (typeof colorRoles)[number];

// RGB channel triplets per theme. Consumed by `theme.css`; kept here as the single
// source of truth for the palette.
export const themes = {
  dark: {
    background: "9 11 20", // near-black blue
    surface: "16 20 34",
    "surface-raised": "24 30 51",
    border: "42 52 84",
    text: "226 232 255",
    "text-muted": "138 150 190",
    accent: "34 211 238", // neon cyan
    "accent-foreground": "6 10 20",
    "neon-cyan": "34 211 238",
    "neon-magenta": "236 72 153",
  },
  light: {
    background: "247 248 252",
    surface: "255 255 255",
    "surface-raised": "241 243 250",
    border: "210 216 234",
    text: "23 27 42",
    "text-muted": "94 104 138",
    accent: "10 111 137", // deep cyan: AA (~5.8:1) as text on light surfaces
    "accent-foreground": "255 255 255",
    "neon-cyan": "8 145 178",
    "neon-magenta": "190 24 118",
  },
} as const satisfies Record<string, Record<ColorRole, string>>;

export type ThemeName = keyof typeof themes;

export const tokens = { colorRoles, themes } as const;
export type Tokens = typeof tokens;
