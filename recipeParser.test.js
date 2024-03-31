const { parseMdToJson, parseAmount } = require("./recipeParser");
describe("recipeParser", () => {
  it("should parse a valid file", () => {
    const obj = parseMdToJson(`
# Bierteig     


## Tags Nudeln, Vegetarisch

## Zutaten

- 200g Mehl
- 1EL ol
- 0.125l Bier (helles)
- pfeffer
- etwas zucker


## Zubereitung

Mehl, Öl, Bier und Milch zu einem glatten Teig verrühren.
Die Eier und den halben TL Salz untermischen.
Den Teig ca. 30 Minuten quellen lassen. In dem Teig kann man nun Gemüse, Obst und Fisch frittieren.

`);
    expect(obj).toMatchSnapshot();
  });

  it("handles malformed files", () => {
    expect(parseMdToJson("")).toBeNull();
    expect(parseMdToJson(undefined)).toBeNull();
    expect(parseMdToJson(null)).toBeNull();
  });

  it("handles missing title", () => {
    const obj = parseMdToJson(`

## Zutaten

- 200g Mehl
- 1EL ol
- 0.125l Bier (helles)


## Zubereitung

Mehl, Öl, Bier und Milch zu einem glatten Teig verrühren.
Die Eier und den halben TL Salz untermischen.
Den Teig ca. 30 Minuten quellen lassen. In dem Teig kann man nun Gemüse, Obst und Fisch frittieren.

`);
    expect(obj).toMatchSnapshot();
  });

  it("handles missing ingredients", () => {
    const obj = parseMdToJson(`
# Bierteig     

## Zubereitung

Mehl, Öl, Bier und Milch zu einem glatten Teig verrühren.
Die Eier und den halben TL Salz untermischen.
Den Teig ca. 30 Minuten quellen lassen. In dem Teig kann man nun Gemüse, Obst und Fisch frittieren.

`);
    expect(obj).toMatchSnapshot();
  });

  it("handles missing description", () => {
    const obj = parseMdToJson(`
    ## Zutaten

    - 200g Mehl
    - 1EL ol
    - 0.125l Bier (helles)
`);
    expect(obj).toMatchSnapshot();
  });
  it("handles empty tags", () => {
    const obj = parseMdToJson(`

    # Title

    ## Tags

    ## Zutaten

    - 200g Mehl
    - 1EL ol
    - 0.125l Bier (helles)
`);
    expect(obj).toMatchSnapshot();
  });
});

describe("parse amount", () => {
  it("parses empty", () => {
    const result = parseAmount("");
    expect(result).toEqual({
      amount: "",
      scale: "",
    });
  });
  it("parses number", () => {
    const result = parseAmount("10");
    expect(result).toEqual({
      amount: "10",
      scale: "",
    });
  });
  it("parses float", () => {
    const result = parseAmount("0.125l");
    expect(result).toEqual({
      amount: "0.125",
      scale: "l",
    });
  });
  it("parses string", () => {
    const result = parseAmount("200g");
    expect(result).toEqual({
      amount: "200",
      scale: "g",
    });
  });
  it("parses all caps", () => {
    const result = parseAmount("1EL");
    expect(result).toEqual({
      amount: "1",
      scale: "EL",
    });
  });
});
