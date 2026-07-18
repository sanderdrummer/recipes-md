import { Input } from "@recipes-md/design-system";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <Input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Suchen… (Titel, Tags, Zutaten)"
      aria-label="Rezepte durchsuchen"
    />
  );
}
