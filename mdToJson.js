const fs = require("fs");

const { parseMdToJson } = require("./recipeParser");
const parse = async () => {
  const folder = fs.readdirSync("./recipes");
  const recipes = folder.map(async (recipe) => {
    const md = fs.readFileSync(`./recipes/${recipe}`, { encoding: "utf8" });
    const parsed = parseMdToJson(md);
    return parsed;
  });
  const parsedRecipes = await Promise.all(recipes);
  fs.writeFileSync("./parsed-recipes.json", JSON.stringify(parsedRecipes));
};

parse();
