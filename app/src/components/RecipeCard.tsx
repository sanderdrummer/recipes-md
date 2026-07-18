import { Badge, Card, cn, Heading } from "@recipes-md/design-system";
import type { Recipe } from "../lib/recipes";

interface RecipeCardProps {
  recipe: Recipe;
}

// Deterministic per-recipe tint so the grid has rhythm without randomness.
// Purely decorative — never carries meaning.
function tintOf(slug: string): "cyan" | "magenta" {
  let sum = 0;
  for (const char of slug) sum += char.charCodeAt(0);
  return sum % 2 === 0 ? "cyan" : "magenta";
}

const MONOGRAM_TINT = {
  cyan: "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan",
  magenta: "border-neon-magenta/40 bg-neon-magenta/10 text-neon-magenta",
} as const;

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card
      href={`#/rezept/${recipe.slug}`}
      className="flex h-full flex-col gap-3"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "flex h-12 w-12 shrink-0 select-none items-center justify-center rounded-lg border font-display text-2xl font-bold",
            MONOGRAM_TINT[tintOf(recipe.slug)],
          )}
        >
          {recipe.title.charAt(0).toUpperCase()}
        </span>
        <Heading level={3} className="min-w-0 hyphens-auto break-words">
          {recipe.title}
        </Heading>
      </div>
      {recipe.tags.length > 0 && (
        <ul className="mt-auto flex flex-wrap gap-1.5">
          {recipe.tags.map((tag) => (
            <li key={tag}>
              <Badge>{tag}</Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
