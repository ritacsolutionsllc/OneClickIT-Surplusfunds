/**
 * Sentry client-side init.
 *
 * Runs in the browser. Keep sample rates conservative to stay under the
 * default org quota — we can bump these once we see real traffic shape.
 */
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance sampling. 10% is standard for early-stage prod.
  tracesSampleRate: 0.1,

  // Session replay — very useful for debugging CRM bugs, but also expensive.
  // Only record 10% of sessions; always record ones where errors happen.
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",

  // Filter noise. Don't log the usual browser-extension / network blips.
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
  ],
});
