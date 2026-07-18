import { Badge, Heading, Text, TextLink } from "@recipes-md/design-system";
import { useParams } from "wouter";
import { getBySlug } from "../lib/recipes";

export default function Recipe() {
  const { slug } = useParams<{ slug: string }>();
  const recipe = getBySlug(slug);

  if (!recipe) {
    return (
      <div>
        <Text>Rezept nicht gefunden.</Text>
        <TextLink href="#/" className="mt-4 inline-block">
          Zurück zur Übersicht
        </TextLink>
      </div>
    );
  }

  return (
    <article>
      <TextLink href="#/" className="text-sm">
        ← Übersicht
      </TextLink>
      <Heading level={1} className="mt-3">
        {recipe.title}
      </Heading>

      {recipe.tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {recipe.tags.map((tag) => (
            <li key={tag}>
              <Badge>{tag}</Badge>
            </li>
          ))}
        </ul>
      )}

      {recipe.ingredients.length > 0 && (
        <section className="mt-6">
          <Heading level={2}>Zutaten</Heading>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {recipe.ingredients.map((ing) => (
              <li key={ing}>{ing}</li>
            ))}
          </ul>
        </section>
      )}

      {recipe.steps.length > 0 && (
        <section className="mt-6">
          <Heading level={2}>Zubereitung</Heading>
          <div className="mt-2 space-y-3 leading-relaxed">
            {recipe.steps.map((step) => (
              <p key={step} className="whitespace-pre-line">
                {step}
              </p>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
