## 1. Tokens & theme variables

- [x] 1.1 Define semantic roles in `tokens.ts` (background, surface, surface-raised, border, text, text-muted, accent, accent-foreground, neon-cyan, neon-magenta); remove `brand`/`ink` scales
- [x] 1.2 Create `theme.css` with role CSS vars as RGB channel triplets: dark values on `:root`, light overrides under `[data-theme="light"]`
- [x] 1.3 Import `theme.css` in `app/src/index.css`

## 2. Tailwind palette override

- [x] 2.1 Rewrite `tailwind-preset.ts` to set `theme.colors` (full override) to `transparent`, `current`, and semantic roles mapped to `rgb(var(--color-*) / <alpha-value>)`
- [x] 2.2 Confirm default Tailwind color utilities no longer generate (raw color class has no effect)

## 3. Theme switching

- [x] 3.1 Add a minimal theme helper/hook in the design system: set `documentElement.dataset.theme`, persist to `localStorage`, default from `prefers-color-scheme` (fallback dark)
- [x] 3.2 Export it from the design system index
- [x] 3.3 Add a toggle control to the app header in `App.tsx`

## 4. Refactor to semantic classes

- [x] 4.1 Update design-system components (Button, Card, Badge, Heading/Text, Input, Container, TextLink) to semantic classes; remove `bg-white`/`text-white`
- [x] 4.2 Update app screens (`App.tsx`, `Overview.tsx`, `Recipe.tsx`, `RecipeCard.tsx`, `SearchBar.tsx`) to semantic classes
- [x] 4.3 Apply cyberpunk treatment: neon accent focus/hover rings and glow on interactive elements using accent/neon roles

## 5. Verify

- [x] 5.1 `npm run check` and `npm run typecheck` pass
- [x] 5.2 `npm run build` succeeds with no missing/undefined color classes
- [x] 5.3 Manually confirm dark default, light toggle, and persistence across reload
