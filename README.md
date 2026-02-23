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
