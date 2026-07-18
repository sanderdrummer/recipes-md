# recipe-scaling

## Purpose

Let users scale a recipe's portion size on the recipe page and carry the selected factor through to displayed ingredient amounts and shopping-list export.

## Requirements

### Requirement: Scale selector on the recipe page

The recipe page SHALL offer a portion scale selector with the factors ½×, 1×, 2×, and 3×, defaulting to 1×. The selector SHALL be a native radio group, fully keyboard operable, with visible focus indication and the selected state conveyed by more than color alone.

#### Scenario: Default scale
- **WHEN** a recipe page is opened
- **THEN** the 1× factor is selected and ingredients show their original amounts

#### Scenario: Keyboard operation
- **WHEN** the user focuses the selector and uses arrow keys
- **THEN** the scale factor changes and the ingredient list updates

### Requirement: Ingredient amounts scale with the selected factor

The system SHALL display each parseable ingredient with its amount multiplied by the selected factor. Unparseable ingredient lines SHALL be displayed unchanged at every factor.

#### Scenario: Scale up
- **WHEN** the user selects 2× on a recipe containing `300g Mehl`
- **THEN** the ingredient is displayed as `600g Mehl`

#### Scenario: Unparseable line unchanged
- **WHEN** the user selects 2× on a recipe containing `etwas Olivenöl`
- **THEN** the line is still displayed as `etwas Olivenöl`

### Requirement: Selected scale applies to shopping-list export

The "zur Einkaufsliste" action SHALL add the ingredients with amounts at the currently selected scale factor.

#### Scenario: Add scaled ingredients
- **WHEN** the user selects 2× and activates "zur Einkaufsliste" on a recipe containing `300g Mehl`
- **THEN** `600g Mehl` is added to the shopping list
