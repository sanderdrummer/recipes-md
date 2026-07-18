import { Badge, Card, Heading } from "@recipes-md/design-system";
import type { Recipe } from "../lib/recipes";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card href={`#/rezept/${recipe.slug}`}>
      <Heading level={3}>{recipe.title}</Heading>
      {recipe.tags.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
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
