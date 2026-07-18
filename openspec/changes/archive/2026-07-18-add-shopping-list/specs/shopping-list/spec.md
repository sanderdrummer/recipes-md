## ADDED Requirements

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

The system SHALL let the user add an item to the list by entering text and confirming. Blank input SHALL NOT create an item.

#### Scenario: Add a new item
- **WHEN** the user enters "Milch" and confirms
- **THEN** an unchecked item "Milch" is appended to the list and the input is cleared

#### Scenario: Duplicate is skipped
- **WHEN** the user adds text that exactly matches an existing item
- **THEN** no new item is created and the existing item is left unchanged

#### Scenario: Blank input rejected
- **WHEN** the user confirms with empty or whitespace-only input
- **THEN** no item is added

### Requirement: Add ingredients from a recipe

The system SHALL provide an action on the recipe page that adds all of the recipe's ingredients to the shopping list, then navigates to the shopping list.

#### Scenario: Add all ingredients
- **WHEN** the user activates "zur Einkaufsliste" on a recipe
- **THEN** each ingredient not already present is appended as an unchecked item, existing exact matches are skipped, and the app navigates to the shopping list

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
