import { describe, expect, it } from "vitest";
import { parseNutrition } from "@/features/recipes/recipes";

describe("parseNutrition", () => {
  it("reads basis and entries", () => {
    const md = `# Foo

## Nährwerte (pro Portion, 4 Portionen)

- Kalorien: 520 kcal
- Ballaststoffe: 7 g
- Protein: 18 g
`;
    expect(parseNutrition(md)).toEqual({
      basis: "pro Portion, 4 Portionen",
      entries: [
        { label: "Kalorien", value: "520 kcal" },
        { label: "Ballaststoffe", value: "7 g" },
        { label: "Protein", value: "18 g" },
      ],
    });
  });

  it("allows a heading without a basis", () => {
    const md = "## Nährwerte\n\n- Kalorien: 90 kcal\n";
    expect(parseNutrition(md)).toEqual({
      basis: null,
      entries: [{ label: "Kalorien", value: "90 kcal" }],
    });
  });

  it("stops at the next section", () => {
    const md = `## Nährwerte (pro Glas)

- Kalorien: 210 kcal

## Zubereitung

Shaken.
`;
    expect(parseNutrition(md)?.entries).toHaveLength(1);
  });

  it("returns null without a section or without entries", () => {
    expect(parseNutrition("# Foo\n\n## Zutaten\n\n- Salz\n")).toBeNull();
    expect(parseNutrition("## Nährwerte (pro Portion)\n\nnix\n")).toBeNull();
  });
});
