// Join class names, dropping falsy entries. Small local helper — no dependency.
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
