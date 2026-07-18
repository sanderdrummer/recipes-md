# Design: Redesign App Visuals

## Context

The app renders 110 markdown recipes with a semantic-token cyberpunk theme, but the layout is boilerplate: default sans everywhere, uniform two-column card grid, recipe page as a flat document. No recipe images exist and none will be provided. Known usage: recipes are read on an iPad while cooking; the shopping list (separate in-flight change `add-shopping-list`) is used on an iPhone.

Constraints: flat design (no glow/shadow), semantic color roles only, WCAG 2.2 AA+, offline-first PWA (no CDN assets).

## Goals / Non-Goals

**Goals:**
- Product-grade visual identity built entirely from typography, spacing, and the existing palette.
- Overview that supports browsing (tag filters, denser grid) not just searching.
- Recipe page optimized for iPad cooking: glanceable steps, ingredients always visible, touch-friendly.
- Design-system-first: new visual primitives live in `packages/design-system`, pages compose them.

**Non-Goals:**
- No recipe images or image pipeline.
- No changes to the markdown recipe format or the `Recipe` data model.
- No shopping-list behavior (owned by `add-shopping-list`); this change only establishes the visual language it will inherit.
- No pixel-perfect upfront spec — details iterate during implementation.

## Decisions

### D1: Fonts — self-hosted via `@fontsource`, display + mono
- **Display/headings**: Space Grotesk (geometric, technical, fits cyberpunk without being a novelty font). **Mono/data**: JetBrains Mono or Space Mono for quantities, counts, tags, meta chips. Body stays system sans for rendering quality and zero cost.
- Bundled through `@fontsource/*` npm packages so the PWA stays offline-capable; no Google Fonts CDN.
- Exposed as Tailwind `fontFamily` roles in the design-system preset (`font-display`, `font-mono-data` or similar) — pages never name raw font families.
- *Alternative considered*: variable font self-hosting by hand — more control, more maintenance; fontsource is enough.

### D2: Monogram cards instead of images
- `RecipeCard` gains a large typographic monogram (first letter of the title) rendered in the display face, outlined/tinted with semantic accent roles, `aria-hidden` (purely decorative).
- Deterministic accent variation (e.g. hash of slug → cyan vs magenta tint) so the grid has rhythm without randomness across reloads. Never color-only meaning — tint is decoration, not information.
- *Alternative considered*: generated SVG patterns — heavier, harder to keep flat/on-palette; a big glyph is more distinctive and cheaper.

### D3: Tag chips are toggle filters, parsed from existing tags
- Tags collected at build time from loaded recipes; rendered as a horizontal chip row under the search bar. Chips are native `<button>`s with `aria-pressed`; selected state shown by fill + border + (non-color) indicator.
- Filter combines with search (AND). Single-select is enough initially (tags are broad categories); multi-select can come later if needed.
- *Alternative considered*: grouped sections per tag — recipes with multiple tags would duplicate; chips + one grid is simpler and interacts cleanly with search.

### D4: Recipe page layout — CSS two-column with sticky ingredient panel
- `lg:`+ viewports (iPad landscape, desktop): steps in the main column, ingredients in a sticky `aside` (`position: sticky`). Narrow viewports (iPad portrait is 768px → `md`): single column, ingredients first. Breakpoint choice verified on-device during implementation.
- DOM order = ingredients before steps (matches cooking flow and mobile layout); no reordering hacks that break tab order.

### D5: Checkable ingredients — session-only, native semantics
- Each ingredient row is a real `<input type="checkbox">` + `<label>` (or `<button aria-pressed>`) with a generous hit area (≥44px). Checked = strikethrough/dim + checkmark, never color alone.
- State is component-local (`useState`), intentionally NOT persisted — it means "gathered on the counter", resets per visit. Distinct from the shopping list's persistent checked state.
- *Alternative considered*: persist per-recipe in localStorage — YAGNI; stale checkmarks from last week are worse than none.

### D6: Presentation-side parsing, no data changes
- `app/src/lib/recipes.ts` (or a small sibling module) gains pure helpers:
  - `splitQuantity("300g Mehl")` → `{ qty: "300g", name: "Mehl" }` via a leading-amount regex; falls back to `{ qty: null, name: full }`. Qty renders in the mono face, name in body face.
  - Step label extraction: leading `Word:`/short-phrase-colon prefix (e.g. `Teig:`, `Streusel:`) becomes the step-card label; otherwise steps are just numbered.
- Parsing is best-effort and must degrade gracefully — a failed parse renders the raw line, never drops content.

### D7: Type scale & density
- Recipe page uses a larger base size (kitchen reading distance); overview uses a denser grid: 1 col phone, 2 `sm`, 3 `md`/iPad portrait, 4 `lg`+.
- Headings move to the display face with a deliberate scale (defined in the preset, not ad-hoc per page).

## Risks / Trade-offs

- [Quantity/step-label regex misfires on messy markdown] → best-effort fallback to raw line; spot-check a sample of the 110 recipes during implementation.
- [Merge friction with in-flight `add-shopping-list` (touches `Recipe.tsx`, header)] → implement this change first or rebase shopping-list UI tasks onto the new layout; the shopping-list *requirements* are unaffected.
- [Display font hurts German long-word legibility at small sizes] → display face for headings/monograms only; body and ingredients stay system sans.
- [Font payload grows the PWA bundle] → subset to latin + latin-ext weights actually used (2–3 weights max).
- [Light theme contrast with new tinted elements] → verify both themes against AA during implementation (existing project rule).

## Open Questions

- Exact display/mono font pairing — pick during implementation, judge on-device (iPad).
- Whether tag chips need multi-select — start single-select, revisit with usage.
