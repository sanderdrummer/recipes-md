## Why

Lint and type errors are currently only caught when someone manually runs `npm run check` / `npm run typecheck`. During assisted editing that's easy to forget, so mistakes accumulate mid-session. We want always-on, fast feedback that fires automatically as files change — without building or maintaining a custom MCP server (the built-in `LSP` tool exposes navigation only, not diagnostics).

## What Changes

- Add a **PostToolUse hook** that runs `biome check` on each edited `*.ts`/`*.tsx` file after `Edit`/`Write`. Biome is per-file and near-instant, so per-edit latency stays negligible.
- Add a **Stop hook** that runs the full `npm run typecheck` once per turn. Whole-program type errors surface before the turn ends, without slowing every edit.
- Non-zero hook output is fed back automatically so errors are seen and fixed on the go.
- No MCP server; configuration lives in `.claude/settings.json`.

## Capabilities

### New Capabilities
- `quality-hooks`: Automatic, always-on lint (Biome, per-edit) and typecheck (tsc, per-turn) feedback via Claude Code hooks.

### Modified Capabilities
<!-- None: no existing specs. -->

## Impact

- New: `.claude/settings.json` (hooks config). Currently absent.
- Uses existing `package.json` scripts (`check`, `typecheck`) and `biome.json`; no dependency changes.
- Affects the local dev/assisted-editing loop only — not CI or build output.
