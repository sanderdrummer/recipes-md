import { Text } from "@recipes-md/design-system";
import { useMemo, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import { searchRecipes } from "../lib/recipes";

export default function Overview() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchRecipes(query), [query]);

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} />
      <Text muted className="mt-3 text-sm">
        {results.length} {results.length === 1 ? "Rezept" : "Rezepte"}
      </Text>
      {results.length === 0 ? (
        <Text className="mt-6">Keine Rezepte gefunden.</Text>
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
