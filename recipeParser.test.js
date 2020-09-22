const { parseMdToJson } = require("./recipeParser");
describe("recipeParser", () => {
  it("should parse a valid file", () => {
    const obj = parseMdToJson(`
# Bierteig     

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
});
