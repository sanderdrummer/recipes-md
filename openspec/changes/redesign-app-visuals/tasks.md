## 1. Typographic foundation (design system)

- [x] 1.1 Add self-hosted display + mono fonts via `@fontsource` packages (latin/latin-ext subsets, 2–3 weights), imported in the design system
- [x] 1.2 Expose semantic `fontFamily` roles and the heading type scale in the Tailwind preset; update `Heading`/`Text` to use them
- [x] 1.3 Verify offline: build and confirm no external font requests; check both themes render correctly

## 2. Overview as browse experience

- [x] 2.1 Add `Monogram` treatment to `RecipeCard` (display-face glyph, `aria-hidden`, deterministic accent tint per slug)
- [x] 2.2 Add tag filter chips under the search bar (native buttons, `aria-pressed`, non-color selected state); collect tags from loaded recipes; filter ANDs with search
- [x] 2.3 Densify the grid responsively (1/2/3/4 columns), refine result count styling (mono face) and empty state with reset hint
- [x] 2.4 Polish header to match the new identity (wordmark in display face)

## 3. Recipe page as cooking tool

- [x] 3.1 Add parsing helpers: `splitQuantity` for ingredient lines and step-label extraction (`Teig:` prefixes), with graceful fallbacks; spot-check against a sample of the 110 recipes
- [x] 3.2 Restructure recipe page into responsive two-column layout: sticky ingredient `aside` on wide viewports, single column (ingredients first) on narrow; verify tab order
- [x] 3.3 Make ingredients checkable (native controls, ≥44px targets, non-color checked state, session-only state)
- [x] 3.4 Render steps as numbered cards (semantic `<ol>`) with parsed labels; bump base type size for kitchen readability

## 4. Verification

- [x] 4.1 A11y pass: keyboard-only walk of overview + recipe page, AA contrast check of all new elements in dark and light themes
- [x] 4.2 Layout check at iPad portrait (768px), iPad landscape (1024px), and phone widths; run `npm run check` and `npm run typecheck`
