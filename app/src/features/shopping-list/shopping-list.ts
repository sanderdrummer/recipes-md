import { useSyncExternalStore } from "react";
import { formatIngredient, parseIngredient } from "@/shared/ingredients";

export interface ShoppingItem {
  id: string;
  text: string;
  checked: boolean;
}

const KEY = "recipes-md:shopping-list";

// Read the list from localStorage, tolerating missing or corrupt data.
function load(): ShoppingItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is ShoppingItem =>
        typeof i === "object" &&
        i !== null &&
        typeof (i as ShoppingItem).id === "string" &&
        typeof (i as ShoppingItem).text === "string" &&
        typeof (i as ShoppingItem).checked === "boolean",
    );
  } catch {
    return [];
  }
}

let items: ShoppingItem[] = load();
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

// Replace the list, persist it, and notify subscribers.
function setItems(next: ShoppingItem[]): void {
  items = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // Ignore write failures (quota exceeded / storage unavailable).
  }
  emit();
}

// Add one text to a list, returning the (possibly unchanged) new list.
// Parseable ingredients merge into an unchecked item with the same unit and
// name (case-insensitive) by summing amounts; checked items are never merged
// into. Unparseable text keeps the old exact-duplicate skip.
function addTo(list: ShoppingItem[], text: string): ShoppingItem[] {
  const trimmed = text.trim();
  if (!trimmed) return list;
  const incoming = parseIngredient(trimmed);
  if (!incoming) {
    if (list.some((i) => i.text === trimmed)) return list;
    return [
      ...list,
      { id: crypto.randomUUID(), text: trimmed, checked: false },
    ];
  }
  for (const item of list) {
    if (item.checked) continue;
    const existing = parseIngredient(item.text);
    if (!existing) continue;
    if (existing.name.toLowerCase() !== incoming.name.toLowerCase()) continue;
    const sameUnit =
      (existing.unit ?? "").toLowerCase() ===
      (incoming.unit ?? "").toLowerCase();
    if (!sameUnit) continue;
    const merged = formatIngredient(
      { ...existing, amount: existing.amount + incoming.amount },
      1,
    );
    return list.map((i) => (i === item ? { ...i, text: merged } : i));
  }
  return [...list, { id: crypto.randomUUID(), text: trimmed, checked: false }];
}

// Add text as a new unchecked item, merging quantities where possible.
export function add(text: string): void {
  const next = addTo(items, text);
  if (next !== items) setItems(next);
}

export function addMany(texts: string[]): void {
  let next = items;
  for (const text of texts) {
    next = addTo(next, text);
  }
  if (next !== items) setItems(next);
}

export function toggle(id: string): void {
  setItems(items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
}

export function clearChecked(): void {
  const next = items.filter((i) => !i.checked);
  if (next.length !== items.length) setItems(next);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Cross-tab sync: another tab's write fires a storage event here.
window.addEventListener("storage", (e) => {
  if (e.key === KEY) {
    items = load();
    emit();
  }
});

function getSnapshot(): ShoppingItem[] {
  return items;
}

export function useShoppingList(): ShoppingItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
