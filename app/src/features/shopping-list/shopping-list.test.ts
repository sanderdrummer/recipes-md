// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

// Node's built-in localStorage global shadows jsdom's in vitest workers and is
// non-functional there; replace it with an in-memory stub before use.
const storage = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
});

// shopping-list keeps module state; drain it through the public API between
// tests instead of touching localStorage directly.
import { add, addMany, clearChecked, toggle } from "./shopping-list";

interface RawItem {
  id: string;
  text: string;
  checked: boolean;
}

function raw(): RawItem[] {
  const stored = localStorage.getItem("recipes-md:shopping-list");
  return stored ? (JSON.parse(stored) as RawItem[]) : [];
}

function texts(): { text: string; checked: boolean }[] {
  return raw().map(({ text, checked }) => ({ text, checked }));
}

function reset(): void {
  for (const item of raw()) {
    if (!item.checked) toggle(item.id);
  }
  clearChecked();
}

describe("shopping list merging", () => {
  beforeEach(() => {
    reset();
  });

  it("sums amounts when unit and name match", () => {
    add("2 Äpfel");
    add("3 Äpfel");
    expect(texts().filter((t) => t.text.includes("Äpfel"))).toEqual([
      { text: "5 Äpfel", checked: false },
    ]);
  });

  it("merges across addMany (recipe export)", () => {
    addMany(["300g Mehl"]);
    addMany(["275g Mehl"]);
    expect(texts().filter((t) => t.text.includes("Mehl"))).toEqual([
      { text: "575g Mehl", checked: false },
    ]);
  });

  it("does not merge different units", () => {
    add("1 EL Öl");
    add("20ml Öl");
    const oil = texts().filter((t) => t.text.includes("Öl"));
    expect(oil.map((t) => t.text)).toEqual(["1 EL Öl", "20ml Öl"]);
  });

  it("never merges into checked items", () => {
    add("2 Bananen");
    const banana = raw().find((i) => i.text === "2 Bananen");
    expect(banana).toBeDefined();
    if (banana) toggle(banana.id);
    add("3 Bananen");
    const bananas = texts().filter((t) => t.text.includes("Bananen"));
    expect(bananas).toEqual([
      { text: "2 Bananen", checked: true },
      { text: "3 Bananen", checked: false },
    ]);
  });

  it("keeps exact-duplicate skip for unparseable text", () => {
    add("etwas Olivenöl");
    add("etwas Olivenöl");
    expect(texts().filter((t) => t.text === "etwas Olivenöl")).toHaveLength(1);
  });

  it("ignores blank input", () => {
    const before = texts().length;
    add("   ");
    expect(texts()).toHaveLength(before);
  });
});
