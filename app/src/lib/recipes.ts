export interface Recipe {
  slug: string;
  title: string;
  tags: string[];
  ingredients: string[];
  steps: string[];
}

// Load every recipe markdown file at build time as raw text.
// recipes/ lives at the repo root, one level above app/.
const modules = import.meta.glob<string>("../../../recipes/*.md", {
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
