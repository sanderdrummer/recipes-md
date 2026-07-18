import { Button, cn, Text } from "@recipes-md/design-system";
import { useMemo, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import { filterTags, hasTag, searchRecipes } from "../lib/recipes";

export default function Overview() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const results = useMemo(() => {
    const found = searchRecipes(query);
    if (activeTag === null) return found;
    return found.filter((r) => hasTag(r, activeTag));
  }, [query, activeTag]);

  const hasFilter = query.trim() !== "" || activeTag !== null;

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} />

      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Nach Tag filtern">
        {filterTags.map((tag) => {
          const selected = tag === activeTag;
          return (
            <li key={tag}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveTag(selected ? null : tag)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  selected
                    ? "border-accent bg-accent font-semibold text-accent-foreground"
                    : "border-border bg-surface text-text-muted hover:border-accent hover:text-text",
                )}
              >
                {selected ? "✓ " : ""}
                {tag}
              </button>
            </li>
          );
        })}
      </ul>

      <Text muted className="mt-4 font-data text-xs uppercase tracking-wider">
        {results.length} {results.length === 1 ? "Rezept" : "Rezepte"}
      </Text>

      {results.length === 0 ? (
        <div className="mt-8 rounded-lg border border-border bg-surface p-6 text-center">
          <Text>Keine Rezepte gefunden.</Text>
          {hasFilter && (
            <Button
              className="mt-4"
              onClick={() => {
                setQuery("");
                setActiveTag(null);
              }}
            >
              Suche zurücksetzen
            </Button>
          )}
        </div>
      ) : (
        <ul className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-3">
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
