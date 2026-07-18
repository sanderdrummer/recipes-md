#!/usr/bin/env bash
# PostToolUse hook: lint the edited TypeScript file with Biome.
# Exit 2 + stderr feeds the diagnostics back to Claude.
set -euo pipefail

input=$(cat)
file=$(printf '%s' "$input" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))")

case "$file" in
  *.ts | *.tsx) ;;
  *) exit 0 ;;
esac
[ -f "$file" ] || exit 0

if ! output=$(npx @biomejs/biome check "$file" 2>&1); then
  echo "$output" >&2
  exit 2
fi
