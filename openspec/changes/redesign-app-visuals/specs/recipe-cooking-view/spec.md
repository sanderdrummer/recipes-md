## ADDED Requirements

### Requirement: Two-column cooking layout
On wide viewports (iPad landscape and up) the recipe page SHALL show preparation steps in a main column and ingredients in a sticky side panel that remains visible while scrolling the steps. On narrower viewports it SHALL show a single column with ingredients before steps. DOM order MUST match the single-column reading order so tab order stays logical in both layouts.

#### Scenario: Sticky ingredients on iPad landscape
- **WHEN** the user scrolls the steps on an iPad-landscape-sized viewport
- **THEN** the ingredient panel remains visible

#### Scenario: Single column on narrow viewports
- **WHEN** the recipe is viewed on a narrow viewport
- **THEN** ingredients render above the steps in one column

### Requirement: Checkable ingredients
Each ingredient SHALL be individually checkable to mark it as gathered. Checked state MUST be conveyed by more than color alone, controls MUST be native and keyboard-operable with touch targets of at least 44px, and the state SHALL reset when the recipe is next visited (not persisted).

#### Scenario: Check an ingredient
- **WHEN** the user activates an ingredient row
- **THEN** it is marked gathered with a non-color-only visual change and the state is exposed to assistive technology

#### Scenario: State is per-visit
- **WHEN** the user leaves the recipe and returns later
- **THEN** all ingredients are unchecked again

### Requirement: Structured ingredient display
Ingredient lines SHALL be displayed with the leading quantity/amount visually separated from the ingredient name (quantity in the mono data face). Lines where no quantity can be identified MUST render unmodified; parsing failures MUST never drop or corrupt content.

#### Scenario: Quantity separated
- **WHEN** an ingredient line "300g Mehl" renders
- **THEN** "300g" appears as a distinct quantity element and "Mehl" as the name

#### Scenario: Unparseable line
- **WHEN** an ingredient line has no recognizable leading quantity
- **THEN** the full line renders as the name, unchanged

### Requirement: Numbered step cards
Preparation steps SHALL render as numbered cards in order. Where a step begins with a short label prefix ending in a colon (e.g. "Teig:"), that label SHALL be shown as the step's title; otherwise the step is numbered only. The steps list MUST remain a semantically ordered list.

#### Scenario: Labeled step
- **WHEN** a step's text begins with "Streusel:"
- **THEN** its card shows "Streusel" as the step title with the remaining text as the body

#### Scenario: Unlabeled step
- **WHEN** a step has no label prefix
- **THEN** its card shows the step number and full text

#### Scenario: Semantic order preserved
- **WHEN** a screen reader reads the preparation section
- **THEN** steps are announced as an ordered list in cooking order
