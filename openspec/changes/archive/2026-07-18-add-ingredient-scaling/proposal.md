## Why

Ingredients are currently opaque strings (`300g Mehl`, `6 Äpfel`). Cooking for more/fewer people means manual math, and adding two recipes to the shopping list produces duplicate lines (`2 Äpfel` + `3 Äpfel`) instead of a combined `5 Äpfel`.

## What Changes

- Parse each ingredient line into amount, unit, and name (e.g. `300g Mehl` → 300 / g / Mehl). Lines without a recognizable amount (`etwas Olivenöl`, `Frische Minzblätter`) stay unparsed strings.
- Recipe page gets a portion/scale control (e.g. ½×, 1×, 2×, 3×). Displayed ingredient amounts scale accordingly; unparseable lines are shown unchanged.
- "zur Einkaufsliste" adds the ingredients at the currently selected scale.
- Adding an ingredient whose unit and name match an existing unchecked list item merges by summing amounts (`2 Äpfel` + `3 Äpfel` → `5 Äpfel`) instead of skipping or duplicating.

## Capabilities

### New Capabilities

- `ingredient-parsing`: extract amount, unit, and name from an ingredient line; format a (possibly scaled) parsed ingredient back to display text. Shared foundation for scaling and merging.
- `recipe-scaling`: portion/scale selector on the recipe page; scaled display of ingredient amounts; scale carried into "add to shopping list".

### Modified Capabilities

- `shopping-list`: "Add ingredients from a recipe" adds scaled amounts; duplicate handling changes from "skip exact text match" to "merge quantities when unit + name match" (for parseable items).

## Impact

- `app/src/lib/recipes.ts` — unchanged (still exposes raw ingredient strings); new `app/src/lib/ingredients.ts` for parsing/scaling/formatting.
- `app/src/lib/shopping-list.ts` — `add`/`addMany` gain merge-by-quantity behavior; stored item shape may gain parsed fields (localStorage data stays backward compatible).
- `app/src/pages/Recipe.tsx` — scale control + scaled ingredient rendering.
- No new dependencies; parsing is a small regex-based utility tuned to the German recipe corpus.
