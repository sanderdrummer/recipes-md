## 1. Ingredient parsing

- [x] 1.1 Create `app/src/lib/ingredients.ts` with `parseIngredient(text)` → `{amount, unit, name} | null` (German units, attached amounts like `300g`/`1Ei`, fractions like `1/2`; null for unparseable lines)
- [x] 1.2 Add `formatIngredient(parsed, factor)` (unicode fractions ½/¼/¾/1½, decimal comma, max 2 decimals, no trailing zeros)
- [x] 1.3 Unit tests covering the corpus formats and the spec scenarios (parse + format)

## 2. Recipe scaling

- [x] 2.1 Add scale selector (½×/1×/2×/3×, native radio group styled as buttons, default 1×, focus-visible ring, selection not color-only) to `app/src/pages/Recipe.tsx`
- [x] 2.2 Render parseable ingredients scaled by the selected factor; unparseable lines verbatim
- [x] 2.3 Pass scaled ingredient texts to `addMany` in the "zur Einkaufsliste" action

## 3. Shopping-list merging

- [ ] 3.1 Extend `add`/`addMany` in `app/src/lib/shopping-list.ts`: parseable input merges into unchecked item with same unit + case-insensitive name (sum amounts, rewrite text); checked items never merged into; unparseable input keeps exact-text skip
- [ ] 3.2 Unit tests for merge, unit mismatch, checked-item, and unparseable-duplicate scenarios

## 4. Verify

- [ ] 4.1 Run Biome + tsc + tests; manual keyboard pass over the scale selector (arrow keys, focus visibility)
