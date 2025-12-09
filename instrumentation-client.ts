// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://7c68175054d66fd456b626418abb265f@o4509278644011008.ingest.us.sentry.io/4510081854603264',

  // Optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Adjust sampling in production or use tracesSampler for more control
  tracesSampleRate: 1,
  enableLogs: true,

  // Replay sampling configuration
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Allow sending user PII
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://c658e25682ffbbce0cd373c74bf48f1d@o4510500686331904.ingest.us.sentry.io/4510500686659584",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  // Environment-aware sampling: 10% in production, 100% in development
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;