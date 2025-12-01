import { getFeatureFlags } from '@/lib/env-validation'
import { cn } from '@/lib/utils'

const FLAG_LABELS: Record<string, string> = {
  hasDatabase: 'Database Connected',
  hasAuth: 'Authentication Configured',
  hasBilling: 'Billing Enabled',
  hasAI: 'AI Providers Available',
  hasEmail: 'Email Service Configured',
  hasSMS: 'SMS Service Configured',
  hasPushNotifications: 'Push Notifications Enabled',
  hasRecaptcha: 'reCAPTCHA Enabled',
}

export function FeatureFlagTest() {
  const flags = getFeatureFlags()
  const entries = Object.entries(flags)

  return (
    <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-holo-surface/80 via-holo-surface to-holo-surface/60 p-6 shadow-[0_0_40px_-15px_rgba(139,92,246,0.45)] backdrop-blur">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg uppercase tracking-[0.3em] text-holo-iris">
          Feature Diagnostics
        </h2>
        <span className="rounded-full bg-holo-iris/10 px-3 py-1 text-xs font-semibold text-holo-iris">
          Environment Check
        </span>
      </header>

      <ul className="space-y-3">
        {entries.map(([key, enabled]) => (
          <li
            key={key}
            className={cn(
              'flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors',
              enabled
                ? 'border-holo-emerald/40 bg-holo-emerald/10 text-holo-emerald'
                : 'border-holo-crimson/40 bg-holo-crimson/10 text-holo-crimson',
            )}
          >
            <span className="font-medium tracking-wide">
              {FLAG_LABELS[key as keyof typeof FLAG_LABELS] ?? key}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.25em]">
              {enabled ? 'ACTIVE' : 'MISSING'}
            </span>
          </li>
        ))}
      </ul>

      <footer className="mt-5 rounded-xl border border-white/5 bg-white/3 px-4 py-3 text-xs text-white/80">
        <p>
          Toggle flags by provisioning the corresponding infrastructure
          secrets. This dashboard renders directly from server-side
          environment validation—no PostHog or client-side toggles involved.
        </p>
      </footer>
    </section>
  )
}
