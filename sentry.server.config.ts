/**
 * Sentry server-side init (Node runtime).
 *
 * Imported by Next.js for server components, server actions, and API route
 * handlers running under the Node.js runtime.
 */
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
});
