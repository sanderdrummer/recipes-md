export default function RecipeCard({ recipe }) {
  return (
    <a
      href={`#/rezept/${recipe.slug}`}
      className="block rounded-lg border border-amber-200 bg-white p-4 shadow-sm transition hover:border-amber-400 hover:shadow-md"
    >
      <h2 className="text-lg font-semibold text-stone-800">{recipe.title}</h2>
      {recipe.tags.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
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
    </a>
  );
}
