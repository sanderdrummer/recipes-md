// Load every recipe markdown file at build time as raw text.
// recipes/ lives at the repo root, one level above app/.
const modules = import.meta.glob("../../../recipes/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const UMLAUTS = { ä: "ae", ö: "oe", ü: "ue", ß: "ss" };

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[äöüß]/g, (c) => UMLAUTS[c])
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Pull the file's base name (without path or .md extension) from a glob key.
function baseName(path) {
  const file = path.split("/").pop() ?? path;
  return file.replace(/\.md$/, "");
}

function parseTitle(text) {
  const match = text.match(/^#\s+(.*)$/m);
  return match ? match[1].trim() : "";
}

function parseTags(text) {
  const match = text.match(/^##\s*Tags(.*)$/m);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

// Return the body lines of a `## <heading>` section, up to the next `## ` heading.
function sectionLines(text, heading) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((l) =>
    new RegExp(`^##\\s+${heading}\\b`).test(l)
  );
  if (start === -1) return [];
  const body = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) break;
    body.push(lines[i]);
  }
  return body;
}

function parseIngredients(text) {
  return sectionLines(text, "Zutaten")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("-"))
    .map((l) => l.replace(/^-\s*/, "").replace(/\t/g, " ").trim())
    .filter(Boolean);
}

function parseSteps(text) {
  const body = sectionLines(text, "Zubereitung").join("\n").trim();
  if (!body) return [];
  // Split prose into paragraphs on blank lines.
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function parse(path, text) {
  const title = parseTitle(text) || baseName(path);
  return {
    slug: slugify(baseName(path)),
    title,
    tags: parseTags(text),
    ingredients: parseIngredients(text),
    steps: parseSteps(text),
  };
}

export const recipes = Object.entries(modules)
  .map(([path, text]) => parse(path, text))
  .sort((a, b) => a.title.localeCompare(b.title, "de"));

const bySlug = new Map();
for (const recipe of recipes) {
  if (bySlug.has(recipe.slug)) {
    console.warn(
      `Duplicate recipe slug "${recipe.slug}" – "${recipe.title}" is unreachable.`
    );
    continue;
  }
  bySlug.set(recipe.slug, recipe);
}

export function getBySlug(slug) {
  return bySlug.get(slug) ?? null;
}

// Case-insensitive substring match over title, tags and ingredients.
export function searchRecipes(query) {
  const q = query.trim().toLowerCase();
  if (!q) return recipes;
  return recipes.filter((r) => {
    const haystack = [r.title, r.tags.join(" "), r.ingredients.join(" ")]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
