/**
 * Next.js instrumentation hook — auto-imports the correct Sentry config
 * per runtime. Required for Next.js 14+ with @sentry/nextjs 8+.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}
