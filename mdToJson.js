const fs = require("fs/promises");

const { parseMdToJson } = require("./recipeParser");
const parse = async () => {
  const folder = await fs.readdir("./recipes");
  const recipes = folder.map(async (recipe) => {
    const md = await fs.readFile(`./recipes/${recipe}`, { encoding: "utf8" });
    const parsed = parseMdToJson(md);
    return parsed;
  });
  const parsedRecipes = await Promise.all(recipes);
  console.log(parsedRecipes);
  fs.writeFile("./parsed-recipes.json", JSON.stringify(parsedRecipes));
};

parse();
