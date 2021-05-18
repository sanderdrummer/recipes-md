// @ts-check
const getTitle = (file = "") => {
  const titleMatcher = /# (.*)/gm;
  const [title] = file.match(titleMatcher);
  return title.replace("#", "").trim();
};

const getIngredients = (file = "") => {
  const ingredientsMatcher = /- (.*)/gm;
  const ingredients = file.match(ingredientsMatcher);

  return ingredients
    ? ingredients
        .filter((maybe) => Boolean(maybe))
        .map((ingredient) => ingredient.replace("-", "").trim())
        .map((ingredient) => {
          const [amount, ...name] = ingredient.split(" ");
          return {
            amount,
            name: name.join(),
          };
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
  const tags = rawtags ? rawtags.replace("## Tags", "").trim().split(",") : [];
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

module.exports = { parseMdToJson };
