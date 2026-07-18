# shopping-list

## Purpose

Provide a device-local shopping list that users can build manually or from a recipe's ingredients, check off items while shopping, and access from the header.

## Requirements

### Requirement: Persistent device-local list

The system SHALL persist the shopping list in `localStorage` so it survives reloads and works fully offline. The list SHALL stay in sync across browser tabs of the same origin.

#### Scenario: List survives reload
- **WHEN** a user has items in the list and reloads the app
- **THEN** the same items with their checked state are shown

#### Scenario: Cross-tab sync
- **WHEN** the list changes in one tab
- **THEN** other open tabs reflect the change without a manual reload

#### Scenario: Empty list
- **WHEN** the list has no items
- **THEN** the shopping list page shows an empty-state message

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

### Requirement: Check off items

The system SHALL let the user toggle an item's checked state.

#### Scenario: Check an item
- **WHEN** the user activates an unchecked item
- **THEN** the item becomes checked and is visually distinguished from unchecked items by more than color alone

#### Scenario: Uncheck an item
- **WHEN** the user activates a checked item
- **THEN** the item becomes unchecked again

### Requirement: Clear checked items

The system SHALL let the user remove all checked items in one action, leaving unchecked items in place.

#### Scenario: Clear checked
- **WHEN** the user activates "Erledigte löschen" with a mix of checked and unchecked items
- **THEN** all checked items are removed and all unchecked items remain

#### Scenario: Nothing to clear
- **WHEN** no items are checked
- **THEN** the clear action has no effect (or is unavailable)

### Requirement: Unchecked count in navigation

The system SHALL show a link to the shopping list in the header, labeled with the number of unchecked items.

#### Scenario: Count reflects unchecked items
- **WHEN** the list has 3 unchecked and 2 checked items
- **THEN** the header link shows the count 3
