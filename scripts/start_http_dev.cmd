@echo off
REM Start Next.js in test HTTP mode by skipping HTTPS redirect
set SKIP_HTTPS_REDIRECT=1
echo Starting Next.js with SKIP_HTTPS_REDIRECT=1
npm run start
