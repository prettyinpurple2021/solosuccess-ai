'use client'

import { useEffect, useState } from 'react'

export function PostHogDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    // Check if PostHog is available on window
    const checkPostHog = () => {
      const info: any = {
        hasWindow: typeof window !== 'undefined',
        hasPostHog: false,
        postHogConfig: null,
        envVars: {
          key: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
          host: !!process.env.NEXT_PUBLIC_POSTHOG_HOST,
        }
      }

      if (typeof window !== 'undefined') {
        info.hasPostHog = !!(window as any).posthog
        if ((window as any).posthog) {
          info.postHogConfig = {
            api_host: (window as any).posthog.config?.api_host,
            token: (window as any).posthog.config?.token ? 'SET' : 'NOT SET',
            loaded: (window as any).posthog.__loaded,
          }
        }
      }

      setDebugInfo(info)
    }

    // Check immediately
    checkPostHog()

    // Check again after a delay to see if PostHog loads
    const timer = setTimeout(checkPostHog, 2000)

    return () => clearTimeout(timer)
  }, [])

  const sendTestEvent = () => {
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('test_event', {
        source: 'debug_component',
        timestamp: new Date().toISOString()
      })
      alert('Test event sent! Check PostHog dashboard.')
    } else {
      alert('PostHog not available on window object')
    }
  }

  return (
    <div className="p-6 border rounded-lg bg-card">
      <h2 className="text-xl font-semibold mb-4">PostHog Debug Info</h2>
      
      <div className="space-y-3 mb-4">
        <div><strong>Window available:</strong> {debugInfo.hasWindow ? '✅' : '❌'}</div>
        <div><strong>PostHog on window:</strong> {debugInfo.hasPostHog ? '✅' : '❌'}</div>
        <div><strong>API Key in env:</strong> {debugInfo.envVars?.key ? '✅' : '❌'}</div>
        <div><strong>Host in env:</strong> {debugInfo.envVars?.host ? '✅' : '❌'}</div>
      </div>

      {debugInfo.postHogConfig && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">PostHog Config:</h3>
          <pre className="text-sm">{JSON.stringify(debugInfo.postHogConfig, null, 2)}</pre>
        </div>
      )}

      <button 
        onClick={sendTestEvent}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={!debugInfo.hasPostHog}
      >
        Send Test Event
      </button>

      {!debugInfo.hasPostHog && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800">
            ⚠️ PostHog not detected. Try refreshing the page or check the browser console for errors.
          </p>
        </div>
      )}
    </div>
  )
}
