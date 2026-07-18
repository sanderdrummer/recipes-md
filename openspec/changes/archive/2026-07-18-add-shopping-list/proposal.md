## Why

Cooking from a recipe means shopping for it first. Today the app shows ingredients per recipe but offers no way to collect what you need to buy. A device-local shopping list closes that loop without adding a backend — fitting the app's existing offline-first, build-time-static nature.

## What Changes

- Add a **shopping list** reachable from a header link that shows the count of unchecked items.
- **Add items manually** via a text input on the shopping list page.
- **Add all ingredients of a recipe** to the list via a button on the recipe page, then navigate to the list.
- **Check off** items by tapping them (toggles a done state).
- **Clear checked** items via a button.
- Persist the list in `localStorage` so it survives reloads and works fully offline; stay in sync across tabs.
- De-duplicate on add by exact string match (no normalization).

## Capabilities

### New Capabilities
- `shopping-list`: A device-local, offline-first shopping list — add items manually or from a recipe, check items off, and clear checked items; persisted in `localStorage`.

### Modified Capabilities
<!-- None: no existing specs. -->

## Impact

- New route `/einkaufsliste` and page component.
- New `shopping-list` store (module-level, `localStorage`-backed, `useSyncExternalStore`).
- Header (`App.tsx`) gains a shopping-list link with unchecked count.
- Recipe page (`Recipe.tsx`) gains an "add to list" action.
- No new dependencies; no backend.
