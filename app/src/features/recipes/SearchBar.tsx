import { Input } from "@recipes-md/design-system";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFocusChange?: (focused: boolean) => void;
}

export default function SearchBar({
  value,
  onChange,
  onFocusChange,
}: SearchBarProps) {
  return (
    <Input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => onFocusChange?.(true)}
      onBlur={() => onFocusChange?.(false)}
      placeholder="Suchen… (Titel, Tags, Zutaten)"
      aria-label="Rezepte durchsuchen"
    />
  );
}
