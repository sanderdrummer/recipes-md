#!/usr/bin/env bash
# Stop hook: run the full workspace typecheck once per turn.
# Exit 2 + stderr feeds type errors back to Claude. stop_hook_active guards against loops.
set -euo pipefail

input=$(cat)
active=$(printf '%s' "$input" | python3 -c "import sys,json; print(json.load(sys.stdin).get('stop_hook_active', False))")
[ "$active" = "True" ] && exit 0

if ! output=$(npm run typecheck 2>&1); then
  echo "$output" >&2
  exit 2
fi
