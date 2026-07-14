import { useMemo, useState } from "react";
import { searchRecipes } from "../lib/recipes.js";
import SearchBar from "../components/SearchBar.jsx";
import RecipeCard from "../components/RecipeCard.jsx";

export default function Overview() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchRecipes(query), [query]);

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} />
      <p className="mt-3 text-sm text-stone-500">
        {results.length} {results.length === 1 ? "Rezept" : "Rezepte"}
      </p>
      {results.length === 0 ? (
        <p className="mt-6 text-stone-600">Keine Rezepte gefunden.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {results.map((recipe) => (
            <li key={recipe.slug}>
              <RecipeCard recipe={recipe} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
