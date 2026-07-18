## ADDED Requirements

### Requirement: Monogram recipe cards
Recipe cards SHALL display a typographic monogram (derived from the recipe title) as a decorative visual anchor alongside the title and tags. The monogram MUST be hidden from assistive technology and carry no information not otherwise present.

#### Scenario: Card shows monogram
- **WHEN** the overview grid renders a recipe
- **THEN** its card shows a monogram in the display face plus the recipe title and tags

#### Scenario: Monogram is decorative
- **WHEN** a screen reader traverses a recipe card
- **THEN** the monogram is not announced; the card's accessible name is the recipe title

### Requirement: Tag filter chips
The overview SHALL show the set of tags found across all recipes as toggleable filter chips. Selecting a chip filters the grid to recipes with that tag; the filter combines with the search query. Chips MUST be keyboard-operable native buttons whose pressed state is exposed to assistive technology and visible by more than color alone.

#### Scenario: Filter by tag
- **WHEN** the user activates the "Backen" chip
- **THEN** the grid shows only recipes tagged "Backen" and the chip appears selected

#### Scenario: Filter combines with search
- **WHEN** a tag chip is selected and a search query is entered
- **THEN** the grid shows only recipes matching both

#### Scenario: Deselect chip
- **WHEN** the user activates an already-selected chip
- **THEN** the filter is removed and the full (search-filtered) grid returns

#### Scenario: Keyboard operation
- **WHEN** the user tabs to a chip and presses Enter or Space
- **THEN** the chip toggles, with a visible focus indicator throughout

### Requirement: Responsive browse grid
The overview grid SHALL scale its density with viewport width (single column on phones up to 3–4 columns on iPad/desktop) and SHALL show a result count and a clear empty state when no recipes match.

#### Scenario: iPad density
- **WHEN** the overview is viewed on an iPad-sized viewport
- **THEN** the grid shows at least 3 columns

#### Scenario: Empty state
- **WHEN** search and/or tag filter match no recipes
- **THEN** a message explains no recipes matched, including how to reset
