const md2json = require("md-2-json");
const fs = require("fs/promises");

const parse = async () => {
  const folder = await fs.readdir("./recipes");
  const recipes = folder.map(async (recipe) => {
    const md = await fs.readFile(`./recipes/${recipe}`, { encoding: "utf8" });
    const parsed = md2json.parse(md);
    return parsed;
  });
  const parsedRecipes = await Promise.all(recipes);
  console.log(parsedRecipes);
  fs.writeFile("./parsed-recipes.json", JSON.stringify(parsedRecipes));
};

parse();
