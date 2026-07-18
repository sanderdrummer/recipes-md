## Context

Ingredients are raw strings parsed from German markdown recipes (`app/src/lib/recipes.ts`). Real corpus formats: `300g Mehl`, `1Ei` (no space, no unit), `1Pck Vanillinzucker`, `6 Äpfel, z. B. Elstar`, `20ml Natives Olivenöl extra`, `1/2 TL …`, and amount-less lines (`etwas Olivenöl`, `Frische Minzblätter`). The shopping list (`app/src/lib/shopping-list.ts`) stores `{id, text, checked}` in localStorage and dedupes by exact text.

## Goals / Non-Goals

**Goals:**
- Parse amount / unit / name from an ingredient line; format it back (German decimal comma, nice fractions like ½).
- Scale a recipe's displayed ingredients by a chosen factor; carry the factor into "zur Einkaufsliste".
- Merge shopping-list additions by summing amounts when unit + name match.

**Non-Goals:**
- Unit conversion (g↔kg, ml↔l) — amounts merge only when units match.
- Singular/plural or synonym matching (`Apfel` ≠ `Äpfel`).
- Persisting the chosen scale, per-recipe portion metadata in markdown, editing amounts in the list UI.

## Decisions

- **New `app/src/lib/ingredients.ts`** with `parseIngredient(text)` → `{amount, unit, name} | null`, `formatIngredient(parsed, factor)`. Regex-based against a fixed German unit list (`g, kg, ml, l, EL, TL, Pck, Prise, Dose, Bund, Stück, Zehe(n), …`); no unit is valid (`1 Ei`). Why regex over a parsing lib: corpus is small and regular, no dependency wanted (YAGNI).
- **`recipes.ts` stays string-based.** Parsing happens at render/add time. Avoids touching the recipe model and keeps unparseable lines flowing through unchanged.
- **Shopping-list storage schema unchanged** (`{id, text, checked}`). Merging re-parses item text on the fly. Why: backward compatible with existing lists, no migration, single source of truth is the display text. Trade-off: parse runs on each add — negligible at list sizes here.
- **Merge rule:** parseable incoming item merges into an *unchecked* item with same normalized unit (case-insensitive; missing unit = missing unit) and same case-insensitive name — amounts summed, text rewritten. Checked items are never merged into (they're already bought); a new unchecked item is added instead. Unparseable items keep today's exact-text skip.
- **Scale control:** ½× / 1× / 2× / 3× as a native radio group styled as buttons (semantic colors, visible focus ring), default 1×, component-local state. Why radios over buttons+aria-pressed: native semantics, one-of-many is exactly what radios model.
- **Number formatting:** halves/quarters render as unicode fractions (½, ¼, ¾, 1½), otherwise up to 2 decimals with comma (`0,75`); trailing zeros stripped.

## Risks / Trade-offs

- [Regex misparses an odd line, e.g. `2-3 Zwiebeln`] → parser is conservative: on anything not clearly `amount [unit] name`, return null and treat as unparseable (displayed/added verbatim, never scaled or merged wrongly).
- [Same ingredient with different units doesn't merge (`1 EL Öl` + `20ml Öl`)] → accepted; both lines appear, user resolves while shopping.
- [Scaling `1 Ei` by ½ yields `½ Ei`] → mathematically correct, cook rounds; no special-casing.
- [Name mismatch from suffixes (`6 Äpfel, z. B. Elstar`)] → name includes the suffix; merge only hits on identical names. Accepted for now.
