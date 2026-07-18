## MODIFIED Requirements

### Requirement: Add item manually

The system SHALL let the user add an item to the list by entering text and confirming. Blank input SHALL NOT create an item. If the input is a parseable ingredient (amount, optional unit, name) and an unchecked item with the same unit and same name (case-insensitive) exists, the system SHALL merge them by summing the amounts and updating the existing item's text. Unparseable input that exactly matches an existing item SHALL NOT create a duplicate.

#### Scenario: Add a new item
- **WHEN** the user enters "Milch" and confirms
- **THEN** an unchecked item "Milch" is appended to the list and the input is cleared

#### Scenario: Quantities merge
- **WHEN** the list contains an unchecked item "2 Äpfel" and the user adds "3 Äpfel"
- **THEN** the existing item becomes "5 Äpfel" and no new item is created

#### Scenario: Duplicate is skipped
- **WHEN** the user adds unparseable text that exactly matches an existing item
- **THEN** no new item is created and the existing item is left unchanged

#### Scenario: Blank input rejected
- **WHEN** the user confirms with empty or whitespace-only input
- **THEN** no item is added

### Requirement: Add ingredients from a recipe

The system SHALL provide an action on the recipe page that adds all of the recipe's ingredients — with amounts at the recipe's currently selected scale factor — to the shopping list, then navigates to the shopping list. Parseable ingredients matching an existing unchecked item by unit and name (case-insensitive) SHALL merge by summing amounts. Checked items SHALL never be merged into; a new unchecked item is added instead. Unparseable ingredients SHALL be appended unless an exact text match already exists.

#### Scenario: Add all ingredients
- **WHEN** the user activates "zur Einkaufsliste" on a recipe
- **THEN** each ingredient is added at the selected scale, merging with unchecked quantity matches, and the app navigates to the shopping list

#### Scenario: Quantities merge across recipes
- **WHEN** the list contains an unchecked "2 Äpfel" and a recipe contributing "3 Äpfel" is added
- **THEN** the list contains a single unchecked item "5 Äpfel"

#### Scenario: Different units do not merge
- **WHEN** the list contains "1 EL Öl" and a recipe contributing "20ml Öl" is added
- **THEN** both items appear separately

#### Scenario: Checked items are not merged into
- **WHEN** the list contains a checked "2 Äpfel" and a recipe contributing "3 Äpfel" is added
- **THEN** a new unchecked item "3 Äpfel" is appended and the checked item is unchanged
