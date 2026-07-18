## Context

The app is a build-time-static PWA (React + Vite + wouter hash routing), already offline via VitePWA. Recipes are parsed from markdown at build time into a read-only array; ingredients are free-text strings (`"1L Brühe"`). There is no persistence layer yet — the shopping list is the first piece of mutable, user-owned state. Two routes need the same live state: the recipe page writes, the list page reads and mutates.

## Goals / Non-Goals

**Goals:**
- Device-local list persisted in `localStorage`, working fully offline.
- Add manually, add from recipe, toggle checked, clear checked.
- Live sync between the header count, the list page, and other tabs.
- Minimal footprint: no new dependencies, no backend.

**Non-Goals:**
- No quantity/unit parsing or aggregation of ingredients (items are plain strings).
- No normalization on dedup (exact-string match only).
- No multi-list, sharing, sync across devices, or reordering.

## Decisions

**Store: module-level state + `useSyncExternalStore`, backed by `localStorage`.**
A single module exposes `subscribe`, `getSnapshot`, and mutators (`add`, `addMany`, `toggle`, `clearChecked`). Components read via a `useShoppingList()` hook wrapping `useSyncExternalStore`. Chosen over React Context (no provider plumbing for a cross-route singleton) and over a state library (YAGNI). A `storage` event listener re-reads and notifies subscribers, giving cross-tab sync for free.

**Item model: `{ id: string; text: string; checked: boolean }`.**
`id` is generated with `crypto.randomUUID()` for stable React keys and toggle/removal targeting (ingredient text is not unique enough long-term, and duplicates could otherwise collide). Persisted as a JSON array under one key, e.g. `recipes-md:shopping-list`.

**Dedup: exact-string match on `add`/`addMany`.**
If an item with identical `text` exists, skip. No trim/case folding — keeps behavior predictable and code trivial. Matches the product decision.

**Add-from-recipe navigation.**
The recipe action calls `addMany(recipe.ingredients)` then navigates to `/einkaufsliste` (wouter `useLocation`/hash), giving immediate confirmation by showing the result.

**a11y.** Items are a real list; toggling uses a native checkbox (or `role`-correct control) with a visible label so checked state is conveyed by the control, not color alone; completed items also get a non-color cue (e.g. strikethrough). Focus-visible indicators and full keyboard operation via native controls. Header count is part of the link's accessible name (e.g. "Einkaufsliste, 3 Artikel"). Semantic color roles only.

## Risks / Trade-offs

- **`localStorage` read/write on every change** → fine for a small list; write is cheap and synchronous.
- **Corrupt/absent JSON in storage** → guard parse with try/catch, fall back to empty list.
- **No aggregation means duplicate-ish lines** (`"1 Zwiebel"` vs `"2 Zwiebeln"`) → accepted; explicitly a non-goal for the first cut.
- **`crypto.randomUUID` availability** → available in all target browsers over HTTPS/localhost (PWA context); acceptable.
