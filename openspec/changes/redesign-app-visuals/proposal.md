# Redesign App Visuals

## Why

The app is functionally solid but visually reads as a boilerplate: default type everywhere, a flat uniform card grid, and a recipe page that is a plain document. With no recipe images available (and none coming), typography and layout must carry the entire product identity. Real usage is known: recipes are read on an iPad while cooking; the layout should be designed for that.

## What Changes

- **Typographic identity**: self-hosted display typeface for headings and a monospace face for data (quantities, counts, meta chips); deliberate type scale replacing Tailwind defaults.
- **Monogram recipe cards**: each card gets an oversized typographic monogram (first letter) as its visual anchor — identity without images, flat cyberpunk styling.
- **Overview becomes a browse experience**: tag filter chips under the search bar (tags act as categories), denser responsive grid (3–4 columns on iPad), refined result count / empty states.
- **Recipe page becomes an iPad cooking tool**: two-column layout on wide viewports with a sticky ingredient panel; ingredients are checkable (tap to mark as gathered, session-only); quantities visually separated from ingredient names; numbered step cards with labels parsed from `Teig:`-style prefixes; larger kitchen-readable base type.
- **Header polish** consistent with the new identity.

Scope is deliberately light on pixel-level detail — visual specifics iterate during implementation. No data-model or markdown-format changes; ingredient quantity/step-label extraction is presentation-side parsing.

## Capabilities

### New Capabilities
- `visual-identity`: The app-wide typographic system — self-hosted fonts, type scale, mono-for-data convention — and the flat cyberpunk presentation rules it must respect (a11y, no raw colors).
- `recipe-browsing`: The overview as a browse experience — search, tag filter chips, monogram card grid, result/empty states.
- `recipe-cooking-view`: The recipe page as a cooking tool — responsive two-column layout, sticky checkable ingredient panel, structured numbered steps.

### Modified Capabilities
<!-- None: only `quality-hooks` exists in openspec/specs/; its requirements are unaffected. The in-flight `add-shopping-list` change is complementary — its UI will inherit this design language but its requirements do not change here. -->

## Impact

- `packages/design-system`: fonts (new self-hosted font assets), tailwind preset (fontFamily, type scale), new/updated primitives (Card variants or Monogram, chip/toggle components as needed).
- `app/src/pages/Overview.tsx`, `app/src/pages/Recipe.tsx`, `app/src/components/RecipeCard.tsx`, `app/src/components/SearchBar.tsx`, `app/src/App.tsx`.
- `app/src/lib/recipes.ts`: presentation-side parsing helpers (quantity split, step labels) — no format changes to `recipes/*.md`.
- New dependency: font package(s) (e.g. `@fontsource/*`) — bundled, no CDN, keeps PWA offline.
- Coordination: the in-flight `add-shopping-list` change touches `Recipe.tsx` and the header; implement against the redesigned layouts to avoid restyling.
