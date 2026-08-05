import {
  Badge,
  Button,
  cn,
  Heading,
  Text,
  TextLink,
} from "@recipes-md/design-system";
import { useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  getBySlug,
  splitQuantity,
  splitStepLabel,
} from "@/features/recipes/recipes";
import { addMany } from "@/features/shopping-list/shopping-list";
import { scaleIngredient } from "@/shared/ingredients";

const SCALES = [
  { value: 0.5, label: "½×" },
  { value: 1, label: "1×" },
  { value: 2, label: "2×" },
  { value: 3, label: "3×" },
];

// Portion scale selector: a native radio group styled as buttons. Selection is
// conveyed by fill AND weight (not color alone); focus ring lives on the label
// via peer-focus-visible since the input itself is visually hidden.
function ScalePicker({
  scale,
  onChange,
}: {
  scale: number;
  onChange: (value: number) => void;
}) {
  return (
    <fieldset className="mt-3">
      <legend className="text-sm text-text-muted">Portionen</legend>
      <div className="mt-1.5 flex gap-2">
        {SCALES.map(({ value, label }) => (
          <label key={value} className="cursor-pointer">
            <input
              type="radio"
              name="scale"
              value={value}
              checked={scale === value}
              onChange={() => onChange(value)}
              className="peer sr-only"
            />
            <span className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border px-3 font-data peer-checked:border-accent peer-checked:bg-accent peer-checked:font-bold peer-checked:text-accent-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface">
              {label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// One checkable ingredient row. Checked = "steht auf der Arbeitsfläche";
// deliberately session-only, resets on the next visit.
function IngredientRow({ ingredient }: { ingredient: string }) {
  const [checked, setChecked] = useState(false);
  const { qty, name } = splitQuantity(ingredient);

  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-surface-raised">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="h-5 w-5 shrink-0 accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      />
      <span className={cn(checked && "text-text-muted line-through")}>
        {qty !== null && <span className="font-data text-accent">{qty} </span>}
        {name}
      </span>
    </label>
  );
}

export default function Recipe() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const [scale, setScale] = useState(1);
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
    <article className="text-lg">
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

      <div className="mt-6 gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        {recipe.ingredients.length > 0 && (
          <aside className="lg:sticky lg:top-6 lg:order-2">
            <Heading level={2}>Zutaten</Heading>
            <ScalePicker scale={scale} onChange={setScale} />
            <div className="mt-3 rounded-lg border border-border bg-surface p-4">
              <ul>
                {recipe.ingredients.map((ing, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: ingredient lines can repeat verbatim; order is static
                  <li key={index}>
                    <IngredientRow ingredient={scaleIngredient(ing, scale)} />
                  </li>
                ))}
              </ul>
              <Button
                className="mt-4 w-full"
                onClick={() => {
                  addMany(
                    recipe.ingredients.map((ing) =>
                      scaleIngredient(ing, scale),
                    ),
                  );
                  navigate("/einkaufsliste");
                }}
              >
                Zur Einkaufsliste hinzufügen
              </Button>
            </div>
          </aside>
        )}

        {recipe.steps.length > 0 && (
          <section className="mt-6 lg:order-1 lg:mt-0">
            <Heading level={2}>Zubereitung</Heading>
            <ol className="mt-3 space-y-4">
              {recipe.steps.map((step, index) => {
                const { label, body } = splitStepLabel(step);
                return (
                  <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: steps are a static ordered list
                    key={index}
                    className="rounded-lg border border-border bg-surface p-4"
                  >
                    <p className="font-data text-sm text-text-muted">
                      Schritt {index + 1}
                      {label !== null && (
                        <span className="font-display text-base font-bold text-accent">
                          {" · "}
                          {label}
                        </span>
                      )}
                    </p>
                    <p className="mt-2 whitespace-pre-line leading-relaxed">
                      {body}
                    </p>
                  </li>
                );
              })}
            </ol>
          </section>
        )}
      </div>
    </article>
  );
}
