## Context

The design system exposes color through numeric Tailwind scales (`brand`, `ink`) added via `theme.extend.colors`, so the full default Tailwind palette is still available and raw colors (`bg-white`, `text-white`) have leaked into components. We want a cyberpunk look, semantic (role-based) color as the only contract, and both dark and light variants. Constraints: npm-workspaces monorepo, Tailwind 3 preset shared by the app, `noExplicitAny`/strict TS, quality hooks run Biome + tsc.

## Goals / Non-Goals

**Goals:**
- Color is referenced only by semantic role names in components/app.
- Raw Tailwind color classes are structurally impossible, not merely discouraged.
- One token set drives dark (default) and light themes, switchable at runtime and persisted.
- Cyberpunk aesthetic: dark surfaces, neon cyan/magenta accents, glow affordances.

**Non-Goals:**
- No per-component theming API or arbitrary user-defined themes (only dark/light).
- No spacing/typography/radius token overhaul — scope is color + minimal neon treatment.
- No new dependencies or CSS framework change.

## Decisions

**1. Override `theme.colors`, don't extend.** The preset sets `theme.colors` to only `transparent`, `current`, and our semantic roles. Tailwind then generates utilities *only* for these names, so `bg-white`/`bg-red-500`/`brand-700` don't exist — a missing class fails visibly (and the Biome/tsc hooks + build surface it). This is the enforcement mechanism. Alternative (a lint rule over class strings) rejected: Biome has no Tailwind-class rule, and it stays a soft convention.

**2. Semantic roles resolved via CSS custom properties.** Each role maps to a CSS var, e.g. `surface: "rgb(var(--color-surface) / <alpha-value>)"`. Values live in `theme.css`: defaults on `:root` (dark) and overrides under `[data-theme="light"]`. This makes the *same* class name theme-aware without duplicate class sets, and keeps Tailwind's opacity modifiers (`bg-surface/80`) working via `<alpha-value>`. Alternative (two static palettes + `dark:` variants on every element) rejected: verbose and leaks both palettes into markup.

**3. Role set (kept small — YAGNI).**
`background`, `surface`, `surface-raised`, `border`, `text`, `text-muted`, `accent`, `accent-foreground`, and `neon.cyan` / `neon.magenta` for glow/highlight. Numeric scales are removed; if a shade is genuinely needed later we add a named role, not a 50–950 ramp.

**4. Theme toggle.** A tiny `ThemeProvider`/`useTheme` (or a single `setTheme` helper) sets `document.documentElement.dataset.theme` and persists to `localStorage`; default resolves to dark (optionally honoring `prefers-color-scheme` on first load). Exported from the design system, mounted in `App.tsx` header. Kept minimal — no context library.

**5. Cyberpunk treatment via tokens, not per-component magic.** Neon comes from the accent/neon roles plus a couple of shared utility patterns (glow ring on focus/hover) expressed with semantic colors, so the vibe rides on the same contract.

## Risks / Trade-offs

- [Overriding the palette breaks any missed raw-color class at build time] → intended; sweep all usages in tasks and rely on the build + hooks to catch stragglers.
- [FOUC / wrong theme flash on load] → set `data-theme` from a tiny inline script before paint, or accept a one-frame default; decided acceptable for this app, inline guard if noticeable.
- [Neon-on-dark contrast/accessibility] → pick accent/text values meeting WCAG AA for body text; neon reserved for accents, not long-form text.
- [`<alpha-value>` requires channel-triplet vars (`34 211 238`), not hex] → store vars as space-separated RGB channels.

## Migration Plan

1. Add `theme.css` (role vars for dark + light) and import in `app/src/index.css`.
2. Rewrite `tokens.ts` to semantic roles; rewrite `tailwind-preset.ts` to override `theme.colors`.
3. Sweep components + app screens to semantic classes; remove `bg-white`/`text-white`.
4. Add theme toggle; mount in header.
5. `npm run check` + `npm run typecheck` + build; fix any now-invalid classes. No rollback concern (single-commit, sole contributor).

## Open Questions

- Exact neon hues and light-mode values — finalized during implementation against the reference image.
- Whether first-load honors `prefers-color-scheme` or always defaults dark (lean: honor it, fall back to dark).
