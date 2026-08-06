#!/usr/bin/env bash
# Stable entry point for COMMIT_DEPLOY.bat.
# Some Windows launchers start Git Bash without its standard tool directories.
CODEX_PY="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/python"
[[ -x "$CODEX_PY/python" || -x "$CODEX_PY/python.exe" ]] && export PATH="$CODEX_PY:$PATH"
export PATH="/usr/bin:/mingw64/bin:$PATH"
if ! command -v python >/dev/null 2>&1; then
  echo "[FAILED] Python was not found. Open Codex once to install its bundled runtime, then try again."
  exit 2
fi
exec /usr/bin/bash tools/ship.sh "$@"
