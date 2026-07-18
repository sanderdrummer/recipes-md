## ADDED Requirements

### Requirement: Self-hosted typographic system
The design system SHALL provide a display typeface for headings and a monospace typeface for data values (quantities, counts, tags, meta chips), exposed as semantic Tailwind font-family roles. Fonts MUST be bundled with the app (no external CDN) so the PWA remains fully offline-capable.

#### Scenario: Fonts load offline
- **WHEN** the app is opened without a network connection (after install)
- **THEN** headings render in the display face and data values in the mono face, with no external font requests

#### Scenario: Pages use semantic font roles
- **WHEN** a component styles text as a heading or data value
- **THEN** it references a design-system font role, not a raw font-family name

### Requirement: Deliberate type scale
The design system SHALL define the heading/body type scale, with a larger base reading size on the recipe page suited to reading at arm's length on an iPad.

#### Scenario: Recipe page readability
- **WHEN** a recipe is viewed on an iPad-sized viewport
- **THEN** body/step text renders at a larger size than the overview's default body text

### Requirement: Flat, accessible presentation preserved
All new visual elements SHALL follow the project's flat design (no glow, drop-shadow, or text-shadow), use only semantic color roles, and meet WCAG 2.2 AA in both dark and light themes.

#### Scenario: Both themes pass contrast
- **WHEN** the new typography, chips, monograms, and panels render in dark and in light theme
- **THEN** all text meets AA contrast (≥4.5:1 body, ≥3:1 large text / UI borders)

#### Scenario: No color-only state
- **WHEN** any element conveys a state (selected chip, checked ingredient)
- **THEN** the state is distinguishable by more than color alone
