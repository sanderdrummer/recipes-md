import { useParams } from "wouter";
import { getBySlug } from "../lib/recipes";

export default function Recipe() {
  const { slug } = useParams<{ slug: string }>();
  const recipe = getBySlug(slug);

  if (!recipe) {
    return (
      <div>
        <p className="text-stone-600">Rezept nicht gefunden.</p>
        <a href="#/" className="mt-4 inline-block text-amber-700 underline">
          Zurück zur Übersicht
        </a>
      </div>
    );
  }

  return (
    <article>
      <a href="#/" className="text-sm text-amber-700 underline">
        ← Übersicht
      </a>
      <h1 className="mt-3 text-3xl font-bold text-stone-800">{recipe.title}</h1>

      {recipe.tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {recipe.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      {recipe.ingredients.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-amber-800">Zutaten</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {recipe.ingredients.map((ing) => (
              <li key={ing}>{ing}</li>
            ))}
          </ul>
        </section>
      )}

      {recipe.steps.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-amber-800">Zubereitung</h2>
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
