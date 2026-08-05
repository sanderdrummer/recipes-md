export interface ParsedIngredient {
  amount: number;
  unit: string | null;
  name: string;
}

// German units seen in the recipe corpus, lowercased for matching.
const UNITS = new Set([
  "g",
  "kg",
  "ml",
  "l",
  "el",
  "tl",
  "pck",
  "prise",
  "prisen",
  "msp",
  "dose",
  "dosen",
  "bund",
  "stück",
  "zehe",
  "zehen",
  "tasse",
  "tassen",
  "becher",
  "glas",
]);

const FRACTION_CHARS: Record<string, number> = {
  "½": 0.5,
  "¼": 0.25,
  "¾": 0.75,
};

// Leading amount: "1/2", "0,5", "1½", "½" or plain integer — in that priority.
const AMOUNT_RE = /^(\d+\s*\/\s*\d+|\d+[.,]\d+|\d*\s*[½¼¾]|\d+)/;

const WORD_RE = /^[A-Za-zÄÖÜäöüß]+/;

function parseAmount(raw: string): number {
  const fractionChar = raw.match(/[½¼¾]/)?.[0];
  if (fractionChar !== undefined) {
    const whole = raw.replace(fractionChar, "").trim();
    return (whole ? Number(whole) : 0) + (FRACTION_CHARS[fractionChar] ?? 0);
  }
  const slash = raw.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (slash?.[1] !== undefined && slash[2] !== undefined) {
    return Number(slash[1]) / Number(slash[2]);
  }
  return Number(raw.replace(",", "."));
}

// Parse "300g Mehl" / "1Ei" / "6 Äpfel, z. B. Elstar" / "1/2 TL Zimt".
// Returns null for lines without a leading recognizable amount.
export function parseIngredient(text: string): ParsedIngredient | null {
  const trimmed = text.trim();
  const amountMatch = trimmed.match(AMOUNT_RE);
  if (!amountMatch) return null;
  const amount = parseAmount(amountMatch[0]);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const rest = trimmed.slice(amountMatch[0].length).trimStart();
  const word = rest.match(WORD_RE)?.[0];
  if (word === undefined) return null;

  if (UNITS.has(word.toLowerCase())) {
    const name = rest.slice(word.length).trim();
    if (!name) return null;
    return { amount, unit: word, name };
  }
  return { amount, unit: null, name: rest };
}

// Render an amount in German notation: ½/¼/¾/1½ for quarters, otherwise a
// decimal comma with at most two decimals and no trailing zeros.
function formatAmount(value: number): string {
  const whole = Math.floor(value);
  const frac = value - whole;
  for (const [char, num] of Object.entries(FRACTION_CHARS)) {
    if (Math.abs(frac - num) < 1e-9) {
      return whole === 0 ? char : `${whole}${char}`;
    }
  }
  const rounded = Math.round(value * 100) / 100;
  return String(rounded).replace(".", ",");
}

// Format a parsed ingredient back to display text, scaled by `factor`.
// Units are attached to the amount, matching the corpus style ("300g Mehl").
export function formatIngredient(
  parsed: ParsedIngredient,
  factor: number,
): string {
  const amount = formatAmount(parsed.amount * factor);
  return parsed.unit
    ? `${amount}${parsed.unit} ${parsed.name}`
    : `${amount} ${parsed.name}`;
}

// Scale an ingredient line if parseable; return it verbatim otherwise.
export function scaleIngredient(text: string, factor: number): string {
  const parsed = parseIngredient(text);
  if (!parsed) return text;
  return formatIngredient(parsed, factor);
}
