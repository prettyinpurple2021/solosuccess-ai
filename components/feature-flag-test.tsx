'use client'

export function FeatureFlagTest() {
  // Feature flags are now disabled - PostHog has been removed
  // These would previously have been controlled by PostHog feature flags
  const myFlagEnabled = false
  const newDashboardEnabled = false
  const betaFeaturesEnabled = false

  return (
    <div className="p-6 border rounded-lg bg-card">
      <h2 className="text-xl font-semibold mb-4">Feature Flag Test</h2>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">my-flag:</span>
          <span className="px-2 py-1 rounded text-sm bg-red-100 text-red-800">
            DISABLED (PostHog removed)
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium">new-dashboard:</span>
          <span className="px-2 py-1 rounded text-sm bg-red-100 text-red-800">
            DISABLED (PostHog removed)
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium">beta-features:</span>
          <span className="px-2 py-1 rounded text-sm bg-red-100 text-red-800">
            DISABLED (PostHog removed)
          </span>
        </div>
      </div>

      {/* Feature flags are disabled since PostHog was removed */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
        <p className="text-gray-800">ℹ️ Feature flags have been disabled. PostHog integration was removed from this application.</p>
      </div>
    </div>
  )
}
