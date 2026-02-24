# build-with-ai

This repository contains the BUILD WITH AI project — a Next.js app with experiments for AI-powered features, leads generation, and a MARZ avatar demo.
# build-with-ai

This repository contains the BUILD WITH AI project — a Next.js app with experiments for AI-powered features, leads generation, and a MARZ avatar demo.

## Deploy (Vercel)

This project uses GitHub Actions to run tests and to optionally deploy to Vercel. The workflow will skip deploy steps if Vercel environment variables are not present in the runner.

Required environment variables for CI deploys (set in GitHub repo `Settings -> Secrets`):

- `VERCEL_TOKEN` — Vercel personal token
- `VERCEL_ORG_ID` — Vercel organization or team scope
- `VERCEL_PROJECT_ID` — Vercel project ID

Local deploy with the Vercel CLI:

```bash
# Install the Vercel CLI (if needed)
npm install -g vercel

# Deploy (preview)
VERCEL_TOKEN="$VERCEL_TOKEN" VERCEL_ORG_ID="$VERCEL_ORG_ID" VERCEL_PROJECT_ID="$VERCEL_PROJECT_ID" npx vercel --confirm --prebuilt --scope "$VERCEL_ORG_ID"

# Deploy production (from `main` branch)
VERCEL_TOKEN="$VERCEL_TOKEN" VERCEL_ORG_ID="$VERCEL_ORG_ID" VERCEL_PROJECT_ID="$VERCEL_PROJECT_ID" npx vercel --confirm --prod --prebuilt --scope "$VERCEL_ORG_ID"
```

Notes:

- The CI includes a lightweight `vercel-validate` job that ensures `npx vercel --version` runs successfully on the runner before any deploy steps. If you do not provide Vercel secrets, the deploy step will be skipped to avoid failing the workflow.
- For full feature support (embeddings, vector DB, queue worker), set additional environment variables as needed: `OPENAI_API_KEY`, `DATABASE_URL`, `REDIS_URL`, `UPSTASH_VECTOR_URL`, `UPSTASH_VECTOR_TOKEN`, `CLEARBIT_KEY`, `HUNTER_API_KEY`.

## Fixing npm deprecation warnings

Some transitive dependencies may print deprecation warnings (e.g., `inflight`, `glob`, `lodash.get`, `sourcemap-codec`). These are usually from upstream packages. To reduce warnings and update transitive deps, try:

```bash
# Upgrade direct dependencies where possible
npm update

# Attempt automatic fixes
npm audit fix --force

# Optional: interactively upgrade all deps
npx npm-check-updates -u
npm install
```

This repo includes an `overrides` section in `package.json` to pin some transitive package versions as a best-effort mitigation.

## Spectral (lint) notes

If you run Spectral linting, use the CLI package and the included ruleset file:

```bash
npm run lint:spectral
```

The repository provides a minimal `.spectral.yaml` ruleset to avoid the "No ruleset has been found" message. Customize that file if you want to enforce API linting rules.

## Local development

Install dependencies and run the dev server:

```bash
npm ci
npm run dev
```

## Running the vercel check locally

```bash
npx vercel --version
```

If you want me to add more deploy automation (e.g., Slack notifications on deploy or tagging releases), tell me which provider to use.

# Distributed Tracing Setup

This project supports distributed tracing via OpenTelemetry for Node.js and API routes.

## Quick Start

1. Install OpenTelemetry SDK:
   ```bash
   npm install @opentelemetry/api @opentelemetry/sdk-node
   ```

2. Configure OpenTelemetry in your entrypoint (e.g., server.js or next.config.js):
   ```js
   // Example setup
   const { NodeSDK } = require('@opentelemetry/sdk-node');
   const sdk = new NodeSDK({
     // Add exporters, instrumentations, etc.
   });
   sdk.start();
   ```

3. Export traces to your preferred backend (Datadog, Jaeger, etc.)

4. Traces are automatically captured for API routes and server functions using `startSpan` from src/lib/tracing.ts.

## Reference
- See src/lib/tracing.ts for integration details.
- For more info: https://opentelemetry.io/docs/instrumentation/js/
