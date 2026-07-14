export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Suchen… (Titel, Tags, Zutaten)"
      aria-label="Rezepte durchsuchen"
      className="w-full rounded-lg border border-amber-300 bg-white px-4 py-2 text-base shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
    />
  );
}
