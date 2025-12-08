// Instrumentation file - loads server polyfills and Sentry
import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Load server polyfills for Node.js runtime
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./lib/server-polyfills');
    await import('./sentry.server.config');
  }

  // Load Sentry for edge runtime
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
