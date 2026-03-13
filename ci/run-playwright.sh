#!/usr/bin/env bash
set -euo pipefail
LOGFILE=/tmp/next-server.log
TEST_EXIT=0

echo "[ci runner] Starting Next.js server (SKIP_HTTPS_REDIRECT=1)"
SKIP_HTTPS_REDIRECT=1 npm run start > "$LOGFILE" 2>&1 &
SERVER_PID=$!

echo "[ci runner] waiting for localhost:3000"
MAX_WAIT=30
i=0
until curl -sSf http://localhost:3000/ >/dev/null 2>&1 || [ $i -ge $MAX_WAIT ]; do
  i=$((i+1))
  sleep 1
done

if ! curl -sSf http://localhost:3000/ >/dev/null 2>&1; then
  echo "[ci runner] server did not start after ${MAX_WAIT}s"
  echo "--- server log ---"
  tail -n +1 "$LOGFILE" || true
  kill "$SERVER_PID" || true
  exit 1
fi

echo "[ci runner] Server ready; running Playwright test"
npx playwright test e2e/repro-nextauth.spec.ts --reporter=list || TEST_EXIT=$?

echo "[ci runner] Playwright finished; capturing server log"
tail -n 500 "$LOGFILE" > ./next-server.log || true
kill "$SERVER_PID" || true

exit ${TEST_EXIT:-0}
