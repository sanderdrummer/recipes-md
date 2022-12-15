// @ts-check
const getTitle = (file = "") => {
  const titleMatcher = /# (.*)/gm;
  const [title] = file.match(titleMatcher);
  return title.replace("#", "").trim();
};

const floatRegex = /([0-9]*[.])?[0-9]+/;
const parseAmount = (amount = "") => {
  if (!amount) {
    return { amount: "", scale: "" };
  }
  const [parsedNumber = ""] = amount.match(floatRegex);
  const scale = amount.replace(parsedNumber, "");
  return { amount: parsedNumber, scale };
};

const getIngredients = (file = "") => {
  const ingredientsMatcher = /- (.*)/gm;
  const ingredients = file.match(ingredientsMatcher);

  return ingredients
    ? ingredients
      .filter((maybe) => Boolean(maybe))
      .map((ingredient) => ingredient.replace("-", "").trim())
      .map((ingredient) => ingredient.replace("\t", ""))
      .map((ingredient) => {
        if (ingredient.match(/^\d+/)) {
          const [amount, ...name] = ingredient.split(" ");
          return {
            ...parseAmount(amount),
            name: name.join(),
          };
        } else {
          return {
            name: ingredient,
            scale: "",
            amount: "",
          };
        }
      })
    : [];
};

const getDescription = (file = "") => {
  const descriptionMatcher = /## Zubereitung/gm;
  return file.match(descriptionMatcher)
    ? file.split(descriptionMatcher).pop().trim()
    : "";
};

const getTags = (file = "") => {
  const tagMatcher = /## Tags (.*)/gm;
  const [rawtags] = file.match(tagMatcher) || [];
  const tags = rawtags
    ? rawtags
      .replace("## Tags", "")
      .trim()
      .split(",")
      .map((tag) => tag.trim())
    : [];
  return tags;
};

const parseMdToJson = (file = "") => {
  if (!file) return null;
  return {
    title: getTitle(file),
    ingredients: getIngredients(file),
    description: getDescription(file),
    tags: getTags(file),
  };
};

module.exports = { parseMdToJson, parseAmount };
