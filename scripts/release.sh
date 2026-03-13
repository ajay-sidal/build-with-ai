#!/usr/bin/env bash
set -euo pipefail

MSG=${1:-"chore: ci(playwright): add runner and docker"}
BRANCH=${2:-main}

echo "Staging all changes..."
git add -A

echo "Committing: $MSG"
git commit -m "$MSG" || { echo "Nothing to commit"; }

echo "Pushing to origin/$BRANCH"
git push origin "$BRANCH"

echo "Installing dependencies and building"
npm ci
npm run build

echo "Running CI Playwright runner locally (will require bash)"
bash ./ci/run-playwright.sh || echo "Playwright run failed; check ./next-server.log"

if command -v vercel >/dev/null 2>&1; then
  read -p "Deploy to Vercel production now? (y/N) " yn
  if [[ "$yn" =~ ^[Yy]$ ]]; then
    vercel --prod
  else
    echo "Skipped Vercel deploy"
  fi
else
  echo "Vercel CLI not found; install with 'npm i -g vercel' to enable deploy step"
fi

echo "Release script finished."
