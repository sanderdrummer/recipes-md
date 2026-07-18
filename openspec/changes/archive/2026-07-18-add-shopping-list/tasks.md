## 1. Store

- [x] 1.1 Create `app/src/lib/shopping-list.ts` with `ShoppingItem = { id; text; checked }`, `localStorage` key `recipes-md:shopping-list`, and a safe load (try/catch → empty array)
- [x] 1.2 Implement module store: `subscribe`, `getSnapshot`, and mutators `add(text)`, `addMany(texts)`, `toggle(id)`, `clearChecked()` with exact-string dedup on add; `id` via `crypto.randomUUID()`
- [x] 1.3 Persist to `localStorage` on every mutation and add a `storage` event listener for cross-tab sync
- [x] 1.4 Export a `useShoppingList()` hook wrapping `useSyncExternalStore`

## 2. Shopping list page

- [x] 2.1 Create `app/src/pages/ShoppingList.tsx` with add-item input (blank rejected, clears on add)
- [x] 2.2 Render items as a list with native checkbox toggle; checked items get a non-color cue (strikethrough) and accessible label
- [x] 2.3 Add "Erledigte löschen" button (unavailable/no-op when nothing checked) and an empty-state message
- [x] 2.4 Register route `/einkaufsliste` in `App.tsx`

## 3. Integration

- [x] 3.1 Add header link to the shopping list in `App.tsx` with unchecked count in its accessible name
- [x] 3.2 Add "zur Einkaufsliste" action on `Recipe.tsx` → `addMany(recipe.ingredients)` then navigate to `/einkaufsliste`

## 4. Verification

- [x] 4.1 Run `npm run typecheck` and `npm run check` (Biome) clean
- [x] 4.2 Manually verify all scenarios: add, add-from-recipe, toggle, clear, reload persistence, cross-tab sync
