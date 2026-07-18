## ADDED Requirements

### Requirement: Automatic lint feedback on edit
The system SHALL run Biome on each edited TypeScript file immediately after it is modified, and SHALL surface any lint or format violations.

#### Scenario: Edited file has a lint violation
- **WHEN** an `Edit` or `Write` modifies a `*.ts` or `*.tsx` file that violates a Biome rule
- **THEN** `biome check` runs on that file and its non-zero output is reported so the violation can be fixed before continuing

#### Scenario: Edited file is clean
- **WHEN** an `Edit` or `Write` modifies a `*.ts` or `*.tsx` file with no Biome violations
- **THEN** the check passes and editing continues without interruption

#### Scenario: Non-TypeScript file edited
- **WHEN** an `Edit` or `Write` modifies a file that is not `*.ts` or `*.tsx`
- **THEN** the lint hook does not run

### Requirement: Automatic typecheck before turn ends
The system SHALL run the full workspace typecheck once at the end of each turn and SHALL surface any type errors.

#### Scenario: Type error present at turn end
- **WHEN** a turn ends and `npm run typecheck` reports a type error
- **THEN** the error output is reported so it can be addressed

#### Scenario: No type errors at turn end
- **WHEN** a turn ends and `npm run typecheck` passes
- **THEN** the turn completes without interruption

### Requirement: Report without auto-fixing
The lint hook SHALL run in read-only mode (`biome check`, not `biome check --write`) so diagnostics are surfaced rather than files silently rewritten.

#### Scenario: Fixable violation detected
- **WHEN** the lint hook detects a violation that Biome could auto-fix
- **THEN** the violation is reported and the file is left unmodified by the hook
