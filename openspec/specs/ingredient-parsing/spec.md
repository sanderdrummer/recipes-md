# ingredient-parsing

## Purpose

Parse German ingredient lines into structured amount/unit/name and format them back for display at arbitrary scale factors.

## Requirements

### Requirement: Parse amount, unit, and name from an ingredient line

The system SHALL parse an ingredient line into amount (number), optional unit, and name. Amounts MAY be written with or without a space before the unit or name, as decimal (comma or dot), or as a simple fraction. Units are recognized from a fixed German list (g, kg, ml, l, EL, TL, Pck, Prise, Dose, Bund, Stück, Zehen and similar). Lines without a leading recognizable amount SHALL be reported as unparseable.

#### Scenario: Amount with attached unit
- **WHEN** `300g Mehl` is parsed
- **THEN** the result is amount 300, unit `g`, name `Mehl`

#### Scenario: Amount without unit
- **WHEN** `6 Äpfel, z. B. Elstar` is parsed
- **THEN** the result is amount 6, no unit, name `Äpfel, z. B. Elstar`

#### Scenario: Amount attached to name
- **WHEN** `1Ei` is parsed
- **THEN** the result is amount 1, no unit, name `Ei`

#### Scenario: Fractional amount
- **WHEN** `1/2 TL Zimt` is parsed
- **THEN** the result is amount 0.5, unit `TL`, name `Zimt`

#### Scenario: Unparseable line
- **WHEN** `etwas Olivenöl` is parsed
- **THEN** the line is reported as unparseable and remains available verbatim

### Requirement: Format a scaled ingredient for display

The system SHALL format a parsed ingredient back to display text, multiplying the amount by a scale factor. Amounts SHALL use German notation: halves and quarters as unicode fractions (½, ¼, ¾, 1½), other non-integers with a decimal comma and at most two decimals, no trailing zeros.

#### Scenario: Integer scaling
- **WHEN** amount 300, unit `g`, name `Mehl` is formatted at factor 2
- **THEN** the output is `600g Mehl`

#### Scenario: Fractional result
- **WHEN** amount 1, no unit, name `Ei` is formatted at factor 0.5
- **THEN** the output is `½ Ei`

#### Scenario: Decimal result
- **WHEN** amount 70, unit `g`, name `Zucchini` is formatted at factor 0.5
- **THEN** the output is `35g Zucchini`
