const recipes = require("./recipes.json");
const fs = require("fs/promises");

recipes.forEach((recipe) => {
  const content = `# ${recipe.title}

## Zutaten

${recipe.ingredients
  .replace(/,/g, "")
  .split("\n")
  .map((ingredient) => `- ${ingredient}`)
  .join("\n")}

## Zubereitung

${recipe.description}
`;
  console.log(content);
  fs.writeFile(`./recipes/${recipe.title}.md`, content, {
    encoding: "utf8",
  });
});
