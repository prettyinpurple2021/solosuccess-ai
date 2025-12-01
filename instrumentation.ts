// Simplified instrumentation file - loads server polyfills
export async function register() {
  // Load server polyfills for Node.js runtime
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./lib/server-polyfills')
  }
}
