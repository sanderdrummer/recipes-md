## ADDED Requirements

### Requirement: Semantic color roles are the only color contract
The design system SHALL expose color exclusively as semantic role names (`background`, `surface`, `surface-raised`, `border`, `text`, `text-muted`, `accent`, `accent-foreground`, `neon-cyan`, `neon-magenta`). Components and app code SHALL reference color only through these roles.

#### Scenario: Component uses a semantic role
- **WHEN** a component needs a background or text color
- **THEN** it uses a semantic class (e.g. `bg-surface`, `text-text-muted`, `border-border`) and no numeric scale or raw color

#### Scenario: No numeric scales remain
- **WHEN** the token set is inspected
- **THEN** it defines named roles only, with no 50–950 numeric ramps (`brand`, `ink`) and no raw color literals in components

### Requirement: Raw Tailwind color tokens are structurally disallowed
The Tailwind theme SHALL fully override `theme.colors` so only `transparent`, `current`, and the semantic roles are defined. Default Tailwind color utilities SHALL NOT be generated.

#### Scenario: Raw color class does not compile
- **WHEN** markup contains `bg-white`, `bg-red-500`, `text-brand-700`, or any default Tailwind color class
- **THEN** no corresponding utility exists and the class has no effect, surfaced by the build

#### Scenario: Semantic class compiles
- **WHEN** markup contains `bg-accent` or `text-text`
- **THEN** the utility is generated and resolves to the active theme's value

### Requirement: Semantic roles are theme-aware via CSS variables
Each semantic role SHALL resolve to a CSS custom property so a single class name yields different values per active theme, while preserving Tailwind opacity modifiers.

#### Scenario: Same class differs by theme
- **WHEN** the active theme changes between dark and light
- **THEN** an element styled `bg-surface` renders the dark surface value under dark and the light surface value under light, with no markup change

#### Scenario: Opacity modifier works
- **WHEN** a class such as `bg-surface/80` is used
- **THEN** it renders the role color at 80% alpha (roles stored as RGB channel triplets)

### Requirement: Cyberpunk dark theme is the default appearance
The default (dark) theme SHALL present a cyberpunk aesthetic: near-black background, dark raised surfaces, and neon cyan/magenta accents used for interactive affordances and highlights.

#### Scenario: Default load
- **WHEN** the app loads with no stored preference and no light `prefers-color-scheme`
- **THEN** it renders the dark cyberpunk theme with neon accents

#### Scenario: Body text contrast
- **WHEN** body text renders on a themed surface
- **THEN** the `text` role meets WCAG AA contrast, and neon roles are used for accents rather than long-form text
