import { describe, expect, it } from "vitest";
import {
  formatIngredient,
  parseIngredient,
  scaleIngredient,
} from "./ingredients";

describe("parseIngredient", () => {
  it("parses amount with attached unit", () => {
    expect(parseIngredient("300g Mehl")).toEqual({
      amount: 300,
      unit: "g",
      name: "Mehl",
    });
  });

  it("parses amount without unit, keeping the full name", () => {
    expect(parseIngredient("6 Äpfel, z. B. Elstar")).toEqual({
      amount: 6,
      unit: null,
      name: "Äpfel, z. B. Elstar",
    });
  });

  it("parses amount attached to name", () => {
    expect(parseIngredient("1Ei")).toEqual({
      amount: 1,
      unit: null,
      name: "Ei",
    });
  });

  it("parses slash fractions", () => {
    expect(parseIngredient("1/2 TL Zimt")).toEqual({
      amount: 0.5,
      unit: "TL",
      name: "Zimt",
    });
  });

  it("parses unicode fractions (round-trip of formatted output)", () => {
    expect(parseIngredient("½ Ei")).toEqual({
      amount: 0.5,
      unit: null,
      name: "Ei",
    });
    expect(parseIngredient("1½ Ei")).toEqual({
      amount: 1.5,
      unit: null,
      name: "Ei",
    });
  });

  it("parses decimal comma amounts", () => {
    expect(parseIngredient("0,75l Milch")).toEqual({
      amount: 0.75,
      unit: "l",
      name: "Milch",
    });
  });

  it("parses corpus formats with multi-word names", () => {
    expect(parseIngredient("20ml Natives Olivenöl extra")).toEqual({
      amount: 20,
      unit: "ml",
      name: "Natives Olivenöl extra",
    });
    expect(parseIngredient("1Pck Vanillinzucker")).toEqual({
      amount: 1,
      unit: "Pck",
      name: "Vanillinzucker",
    });
  });

  it("returns null for lines without a leading amount", () => {
    expect(parseIngredient("etwas Olivenöl")).toBeNull();
    expect(parseIngredient("Frische Minzblätter")).toBeNull();
  });

  it("returns null for ranges and amount-only lines", () => {
    expect(parseIngredient("2-3 Zwiebeln")).toBeNull();
    expect(parseIngredient("300g")).toBeNull();
    expect(parseIngredient("42")).toBeNull();
  });
});

describe("formatIngredient", () => {
  it("scales integers", () => {
    expect(formatIngredient({ amount: 300, unit: "g", name: "Mehl" }, 2)).toBe(
      "600g Mehl",
    );
  });

  it("renders halves as unicode fractions", () => {
    expect(formatIngredient({ amount: 1, unit: null, name: "Ei" }, 0.5)).toBe(
      "½ Ei",
    );
    expect(formatIngredient({ amount: 3, unit: null, name: "Eier" }, 0.5)).toBe(
      "1½ Eier",
    );
  });

  it("renders other decimals with a comma, no trailing zeros", () => {
    expect(
      formatIngredient({ amount: 70, unit: "g", name: "Zucchini" }, 0.5),
    ).toBe("35g Zucchini");
    expect(formatIngredient({ amount: 0.2, unit: "l", name: "Milch" }, 2)).toBe(
      "0,4l Milch",
    );
  });
});

describe("scaleIngredient", () => {
  it("scales parseable lines and leaves unparseable lines verbatim", () => {
    expect(scaleIngredient("300g Mehl", 2)).toBe("600g Mehl");
    expect(scaleIngredient("etwas Olivenöl", 2)).toBe("etwas Olivenöl");
  });
});
