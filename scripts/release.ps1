param(
  [string]$Message = "chore: ci(playwright): add runner and docker",
  [string]$Branch = "main"
)

Write-Host "Staging all changes..."
git add -A

try {
  Write-Host "Committing: $Message"
  git commit -m $Message
} catch {
  Write-Host "Nothing to commit"
}

Write-Host "Pushing to origin/$Branch"
git push origin $Branch

Write-Host "Installing dependencies and building"
npm ci
npm run build

Write-Host "Running CI Playwright runner locally"
bash ./ci/run-playwright.sh

if (Get-Command vercel -ErrorAction SilentlyContinue) {
  $ans = Read-Host "Deploy to Vercel production now? (y/N)"
  if ($ans -match '^[Yy]') {
    vercel --prod
  } else {
    Write-Host "Skipped Vercel deploy"
  }
} else {
  Write-Host "Vercel CLI not found; install with 'npm i -g vercel' to enable deploy step"
}

Write-Host "Release script finished."
