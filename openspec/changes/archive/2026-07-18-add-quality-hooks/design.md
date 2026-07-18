## Context

Assisted editing has no automatic quality gate: errors only appear when `npm run check` / `npm run typecheck` are run by hand. The repo is a small npm-workspaces monorepo (~15 source files, `skipLibCheck: true`), so full runs are cheap. The built-in `LSP` tool offers navigation only (no diagnostics), and there is no maintained official Biome MCP — so an MCP would mean building and owning an LSP-diagnostics client to wrap commands we can already run.

## Goals / Non-Goals

**Goals:**
- Lint feedback fires automatically on every edit, with negligible latency.
- Type errors surface automatically before a turn ends.
- Near-zero infrastructure and maintenance.

**Non-Goals:**
- No custom MCP server or long-running daemon.
- No CI or build-pipeline changes.
- No TS project-references / incremental-build rework (not needed at this size).

## Decisions

**1. Hooks, not an MCP.** Hooks fire automatically (push); an MCP must be explicitly called (pull), so it can't be "always-on". Hooks are ~15 lines in `.claude/settings.json` vs. a server to build and maintain. Alternative (custom MCP wrapping `biome lsp-proxy` + `tsserver` diagnostics) rejected as strictly more work for less of the goal.

**2. Two-tier cadence — Biome per-edit, tsc per-turn.** Biome is per-file and near-instant → `PostToolUse` on `Edit`/`Write` for `*.ts`/`*.tsx`, checking only the changed file. `tsc` is whole-program and slower → run `npm run typecheck` once on the `Stop` hook rather than on every edit. This keeps per-edit latency near-zero while still catching cross-file type errors each turn. Alternative (tsc on every edit) rejected: repeated whole-program cost with no benefit at this scale.

**3. Report, don't auto-fix.** Hooks run `biome check` (read-only), not `check --write`, so diagnostics are surfaced for a deliberate fix rather than silently rewritten mid-edit.

## Risks / Trade-offs

- [Per-turn typecheck misses an error mid-turn if I stop early] → Stop hook still runs at turn end; acceptable given repo size.
- [Hook noise on unrelated pre-existing errors] → scope Biome hook to the changed file; typecheck is already expected to be clean.
- [Typecheck slows as repo grows] → revisit with TS project references + `tsc --build` incremental if it becomes noticeable (tracked as future work, not now).

## Open Questions

None blocking. Typecheck cadence decided as per-turn (Stop hook).
