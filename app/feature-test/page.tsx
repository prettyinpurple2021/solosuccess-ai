import { FeatureFlagTest } from '@/components/feature-flag-test'
import { PostHogDebug } from '@/components/posthog-debug'

export default function FeatureTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Feature Flag Testing</h1>
      <PostHogDebug />
      <div className="mt-8">
        <FeatureFlagTest />
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">How to test:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Go to your PostHog dashboard</li>
          <li>Navigate to Feature Flags</li>
          <li>Create a new flag called "my-flag"</li>
          <li>Toggle it on/off and refresh this page</li>
          <li>Watch the status change in real-time!</li>
        </ol>
      </div>
    </div>
  )
}