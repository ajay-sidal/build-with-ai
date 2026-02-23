// Distributed tracing setup using OpenTelemetry
import { trace, context, Span, SpanKind } from '@opentelemetry/api'

export type TraceMeta = Record<string, string | number | boolean | undefined>

/**
 * Starts a span for distributed tracing. Integrates with OpenTelemetry if available.
 * Falls back to lightweight debug output if OpenTelemetry is not configured.
 */
export function startSpan(name: string, meta?: TraceMeta): { end: (meta?: TraceMeta) => void } {
  let otelSpan: Span | null = null
  try {
    const tracer = trace.getTracer('build-with-ai')
    otelSpan = tracer.startSpan(name, { kind: SpanKind.INTERNAL, attributes: meta }, context.active())
  } catch {
    // OpenTelemetry not configured, fallback
    otelSpan = null
  }
  const start = Date.now()
  let ended = false
  return {
    end: (endMeta?: TraceMeta) => {
      if (ended) return
      ended = true
      const durationMs = Date.now() - start
      if (otelSpan) {
        if (endMeta) {
          Object.entries(endMeta).forEach(([k, v]) => {
            if (v !== undefined) otelSpan!.setAttribute(k, v)
          })
        }
        otelSpan.end()
      } else {
        // lightweight trace output
        try {
          const payload = JSON.stringify({ ts: new Date().toISOString(), span: name, durationMs, ...(endMeta || {}) })
          // eslint-disable-next-line no-console
          console.debug(payload)
        } catch {
          // fallback
          // eslint-disable-next-line no-console
          console.debug(`span:${name} duration:${durationMs}`)
        }
      }
    },
  }
}

/**
 * To enable distributed tracing, install OpenTelemetry SDK and configure exporters (e.g., Datadog, Jaeger).
 * Example: npm install @opentelemetry/api @opentelemetry/sdk-node
 * See README or docs for setup instructions.
 */
