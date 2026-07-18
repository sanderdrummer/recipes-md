# Project rules

## Accessibility (non-negotiable)

Every change to the UI or design system MUST be fully accessible. We aim for
**perfect a11y compliance** (WCAG 2.2 AA or better). This is a hard requirement,
not a nice-to-have.

- **Color contrast:** text meets WCAG AA (≥4.5:1 body, ≥3:1 large text / UI
  borders). Neon accents are for accents, never long-form text. Verify both the
  dark and light themes.
- **Focus:** every interactive element has a visible `focus-visible` indicator
  (ring + offset). Never remove focus outlines without an equivalent replacement.
- **Semantics:** use native elements (`button`, `a`, `label`, headings in order).
  Icon-only controls get an `aria-label`. Don't recreate native behavior with divs.
- **Keyboard:** everything operable by keyboard; logical tab order; no traps.
- **State & motion:** don't rely on color alone to convey meaning; respect
  `prefers-reduced-motion`.
- **Images/media:** meaningful images have `alt`; decorative ones are hidden.

When in doubt, choose the more accessible option. Do not ship a design-system
change that regresses accessibility.

## Design

- **Flat design** — no glow, drop-shadows, or `text-shadow`. Use borders and
  color/contrast for affordances.
- **Semantic colors only.** Reference color through the design system's semantic
  roles (`bg-surface`, `text-text`, `accent`, `neon-*`, …). Raw Tailwind color
  tokens (`bg-white`, `bg-red-500`, numeric scales) are forbidden and structurally
  unavailable — the Tailwind palette is overridden in the design-system preset.
