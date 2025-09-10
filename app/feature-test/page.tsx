import { FeatureFlagTest } from '@/components/feature-flag-test'
import { PostHogDebug } from '@/components/posthog-debug'

export default function FeatureTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics & Feature Testing</h1>
      <PostHogDebug />
      <div className="mt-8">
        <FeatureFlagTest />
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">About this page:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>PostHog integration has been removed from this application</li>
          <li>Feature flags are now disabled and managed internally if needed</li>
          <li>Basic analytics are still tracked via the internal analytics service</li>
          <li>This page shows the current state after PostHog removal</li>
        </ul>
      </div>
    </div>
  )
}