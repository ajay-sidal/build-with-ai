export type TraceMeta = Record<string, unknown>

export function startSpan(name: string) {
  const start = Date.now()
  let ended = false
  return {
    end: (meta?: TraceMeta) => {
      if (ended) return
      ended = true
      const durationMs = Date.now() - start
      // lightweight trace output; in production this would forward to APM or OpenTelemetry
      try {
        const payload = JSON.stringify({ ts: new Date().toISOString(), span: name, durationMs, ...(meta || {}) })
        // eslint-disable-next-line no-console
        console.debug(payload)
      } catch {
        // fallback
        // eslint-disable-next-line no-console
        console.debug(`span:${name} duration:${durationMs}`)
      }
    },
  }
}
