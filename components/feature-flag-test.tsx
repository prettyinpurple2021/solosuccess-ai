'use client'

import { useFeatureFlagEnabled } from 'posthog-js/react'

export function FeatureFlagTest() {
  // Test a feature flag called 'my-flag'
  const myFlagEnabled = useFeatureFlagEnabled('my-flag')
  
  // You can test multiple flags
  const newDashboardEnabled = useFeatureFlagEnabled('new-dashboard')
  const betaFeaturesEnabled = useFeatureFlagEnabled('beta-features')

  return (
    <div className="p-6 border rounded-lg bg-card">
      <h2 className="text-xl font-semibold mb-4">Feature Flag Test</h2>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">my-flag:</span>
          <span className={`px-2 py-1 rounded text-sm ${
            myFlagEnabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {myFlagEnabled ? 'ENABLED' : 'DISABLED'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium">new-dashboard:</span>
          <span className={`px-2 py-1 rounded text-sm ${
            newDashboardEnabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {newDashboardEnabled ? 'ENABLED' : 'DISABLED'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium">beta-features:</span>
          <span className={`px-2 py-1 rounded text-sm ${
            betaFeaturesEnabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {betaFeaturesEnabled ? 'ENABLED' : 'DISABLED'}
          </span>
        </div>
      </div>

      {/* Conditional rendering based on flags */}
      {myFlagEnabled && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-800">🎉 The "my-flag" feature is enabled!</p>
        </div>
      )}

      {newDashboardEnabled && (
        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <p className="text-purple-800">✨ New dashboard is active!</p>
        </div>
      )}

      {betaFeaturesEnabled && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
          <p className="text-orange-800">🧪 Beta features are available!</p>
        </div>
      )}
    </div>
  )
}
