## ADDED Requirements

### Requirement: Runtime theme selection
The design system SHALL provide a way to select the dark or light theme at runtime, applied by setting a `data-theme` attribute on the document root.

#### Scenario: User toggles theme
- **WHEN** the user activates the theme toggle
- **THEN** `document.documentElement`'s `data-theme` switches between `dark` and `light` and all semantic-colored elements update immediately

#### Scenario: Toggle control is available
- **WHEN** the app renders
- **THEN** a theme toggle control is present in the header

### Requirement: Theme preference persistence
The selected theme SHALL persist across reloads.

#### Scenario: Preference restored on reload
- **WHEN** the user selects light and reloads the app
- **THEN** the app restores light from persisted storage

#### Scenario: First visit default
- **WHEN** there is no stored preference
- **THEN** the theme resolves from `prefers-color-scheme`, defaulting to dark when not light
