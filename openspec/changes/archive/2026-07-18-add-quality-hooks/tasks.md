## 1. Lint hook (per-edit)

- [x] 1.1 Create `.claude/settings.json` with a `PostToolUse` hook matching `Edit`/`Write`
- [x] 1.2 Run `biome check` on the edited file only, scoped to `*.ts`/`*.tsx` (skip other files)
- [x] 1.3 Ensure non-zero exit surfaces Biome output as feedback

## 2. Typecheck hook (per-turn)

- [x] 2.1 Add a `Stop` hook that runs `npm run typecheck`
- [x] 2.2 Ensure non-zero exit surfaces the type errors as feedback

## 3. Verify

- [x] 3.1 Introduce a temporary lint violation in a `.ts` file, edit it, confirm the hook reports it
- [x] 3.2 Introduce a temporary type error, end a turn, confirm the Stop hook reports it
- [x] 3.3 Confirm a clean edit and clean turn pass without interruption; remove temporary errors
