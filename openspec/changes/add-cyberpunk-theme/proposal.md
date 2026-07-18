## Why

The app currently uses a warm amber/stone palette (`brand`/`ink` numeric scales) plus a few raw Tailwind colors (`bg-white`, `text-white`). We want a modern, cyberpunk vibe — dark neon-on-black surfaces with cyan/magenta accents — and a design system where components reference **semantic color roles** (surface, text, accent, …), never raw Tailwind color tokens. Making the theme role-based also lets us support a light variant from the same tokens.

## What Changes

- Replace the numeric `brand`/`ink` token scales with **semantic color roles**: `background`, `surface`, `surface-raised`, `border`, `text`, `text-muted`, `accent`, `accent-foreground`, plus a small `neon` accent set (cyan/magenta) for glows/highlights.
- Drive roles via **CSS custom properties** so the same class names resolve to a **dark** (default, cyberpunk) or **light** palette, switched by a root `data-theme`/class. Add a runtime theme toggle.
- **BREAKING (internal):** Tailwind's `theme.colors` is fully **overridden** (not extended). Raw color classes (`bg-white`, `bg-red-500`, `brand-700`, `ink-800`) no longer exist — only semantic classes compile. This structurally forbids direct Tailwind color tokens.
- Refactor all design-system components and app screens to use semantic classes; remove the three raw-color usages.
- Add cyberpunk visual treatment: dark base, neon accent borders/focus rings, subtle glow on interactive elements.

## Capabilities

### New Capabilities
- `design-tokens`: Semantic color roles as the sole color contract, theme-aware via CSS variables, with raw Tailwind color tokens structurally disallowed.
- `theme-switching`: Dark (default) / light theme selection at runtime, persisted.

### Modified Capabilities
<!-- None: quality-hooks unaffected; no existing color spec. -->

## Impact

- `packages/design-system/`: `tokens.ts`, `tailwind-preset.ts`, all components; new theme CSS (variables) and a theme-toggle export.
- `app/`: `index.css` (import theme vars), `App.tsx` + pages (semantic classes, mount toggle), `tailwind.config.ts` (via preset).
- No new runtime dependencies. Enforced by the palette override; the existing Biome/tsc quality hooks catch regressions.
