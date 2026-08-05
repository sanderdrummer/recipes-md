export interface Recipe {
  slug: string;
  title: string;
  tags: string[];
  ingredients: string[];
  steps: string[];
}

// Load every recipe markdown file at build time as raw text.
// recipes/ lives at the repo root, above app/src/features/recipes/.
const modules = import.meta.glob<string>("../../../../recipes/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const UMLAUTS: Record<string, string> = { ä: "ae", ö: "oe", ü: "ue", ß: "ss" };

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[äöüß]/g, (c) => UMLAUTS[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Pull the file's base name (without path or .md extension) from a glob key.
function baseName(path: string): string {
  const file = path.split("/").pop() ?? path;
  return file.replace(/\.md$/, "");
}

function parseTitle(text: string): string {
  const match = text.match(/^#\s+(.*)$/m);
  return match?.[1]?.trim() ?? "";
}

function parseTags(text: string): string[] {
  const match = text.match(/^##\s*Tags(.*)$/m);
  const raw = match?.[1];
  if (raw === undefined) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

// Return the body lines of a `## <heading>` section, up to the next `## ` heading.
function sectionLines(text: string, heading: string): string[] {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((l) =>
    new RegExp(`^##\\s+${heading}\\b`).test(l),
  );
  if (start === -1) return [];
  const body: string[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line === undefined || /^##\s+/.test(line)) break;
    body.push(line);
  }
  return body;
}

function parseIngredients(text: string): string[] {
  return sectionLines(text, "Zutaten")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("-"))
    .map((l) => l.replace(/^-\s*/, "").replace(/\t/g, " ").trim())
    .filter(Boolean);
}

function parseSteps(text: string): string[] {
  const body = sectionLines(text, "Zubereitung").join("\n").trim();
  if (!body) return [];
  // Split prose into paragraphs on blank lines.
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function parse(path: string, text: string): Recipe {
  const title = parseTitle(text) || baseName(path);
  return {
    slug: slugify(baseName(path)),
    title,
    tags: parseTags(text),
    ingredients: parseIngredients(text),
    steps: parseSteps(text),
  };
}

export const recipes: Recipe[] = Object.entries(modules)
  .map(([path, text]) => parse(path, text))
  .sort((a, b) => a.title.localeCompare(b.title, "de"));

const bySlug = new Map<string, Recipe>();
for (const recipe of recipes) {
  if (bySlug.has(recipe.slug)) {
    console.warn(
      `Duplicate recipe slug "${recipe.slug}" – "${recipe.title}" is unreachable.`,
    );
    continue;
  }
  bySlug.set(recipe.slug, recipe);
}

export function getBySlug(slug: string | undefined): Recipe | null {
  if (slug === undefined) return null;
  return bySlug.get(slug) ?? null;
}

// Tags worth filtering by: deduplicated case-insensitively (the markdown mixes
// "Vegetarisch" and "vegetarisch") and used by at least 3 recipes — the long
// tail of one-off tags (typos, oddities) stays reachable via search instead.
const tagCounts = new Map<string, number>();
for (const tag of recipes.flatMap((r) => r.tags)) {
  const key = tag.trim().toLowerCase();
  tagCounts.set(key, (tagCounts.get(key) ?? 0) + 1);
}

export const filterTags: string[] = [...tagCounts.entries()]
  .filter(([, count]) => count >= 3)
  .map(([tag]) => tag)
  .sort((a, b) => a.localeCompare(b, "de"))
  .map((t) => t.charAt(0).toUpperCase() + t.slice(1));

export function hasTag(recipe: Recipe, tag: string): boolean {
  const t = tag.toLowerCase();
  return recipe.tags.some((own) => own.trim().toLowerCase() === t);
}

// --- Presentation-side parsing (best effort, never drops content) ---

export interface IngredientParts {
  qty: string | null;
  name: string;
}

// Common German recipe units. Matched only at a word boundary so "1Ei" keeps
// "Ei" as the name while "1TL Zimt" pulls "TL" into the quantity.
const UNIT_RE =
  /^(g|kg|mg|ml|cl|l|el|tl|pck|pkg|päckchen|prisen?|stücke?|bund|dosen?|becher|tassen?|zehen?|scheiben?|gläser|glas|tropfen|msp\.?)(?=\s|$)/i;

const AMOUNT_RE =
  /^(ca\.\s*)?(\d+(?:[.,/]\d+)?(?:\s*[-–]\s*\d+(?:[.,/]\d+)?)?)\s*(.*)$/;

// Split "300g Mehl" into { qty: "300g", name: "Mehl" }. Lines without a
// recognizable leading amount come back unmodified as the name.
export function splitQuantity(line: string): IngredientParts {
  const match = line.match(AMOUNT_RE);
  if (!match) return { qty: null, name: line };
  let qty = (match[1] ?? "") + (match[2] ?? "");
  let rest = match[3] ?? "";
  const unit = rest.match(UNIT_RE);
  if (unit?.[1] !== undefined) {
    qty += unit[1];
    rest = rest.slice(unit[1].length).trim();
  }
  if (!rest) return { qty: null, name: line };
  return { qty: qty.trim(), name: rest };
}

export interface StepParts {
  label: string | null;
  body: string;
}

// Steps often start with a short "Teig:" / "Streusel:" prefix; surface it as a
// label. Anything longer than a few words is prose, not a label.
const STEP_LABEL_RE = /^([A-ZÄÖÜ][^:\n]{0,30}):\s*/;

export function splitStepLabel(step: string): StepParts {
  const match = step.match(STEP_LABEL_RE);
  if (!match || match[1] === undefined) return { label: null, body: step };
  return { label: match[1], body: step.slice(match[0].length) };
}

// Case-insensitive substring match over title, tags and ingredients.
export function searchRecipes(query: string): Recipe[] {
  const q = query.trim().toLowerCase();
  if (!q) return recipes;
  return recipes.filter((r) => {
    const haystack = [r.title, r.tags.join(" "), r.ingredients.join(" ")]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
