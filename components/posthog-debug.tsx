'use client'

export function PostHogDebug() {
  return (
    <div className="p-6 border rounded-lg bg-card">
      <h2 className="text-xl font-semibold mb-4">Analytics Debug Info</h2>
      
      <div className="space-y-3 mb-4">
        <div><strong>PostHog Status:</strong> ❌ Removed</div>
        <div><strong>Analytics:</strong> ✅ Basic analytics still available via internal system</div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-blue-800">
          ℹ️ PostHog integration has been removed from this application. Basic analytics are still tracked internally.
        </p>
      </div>
    </div>
  )
}
