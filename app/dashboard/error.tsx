'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Dashboard Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cyber-black">
      <Card className="w-full max-w-lg border-2 border-red-500/50 bg-black/80 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <AlertCircle className="h-6 w-6" />
            <CardTitle className="text-xl font-sci text-white">System Malfunction</CardTitle>
          </div>
          <CardDescription className="text-gray-400 font-tech">
            The dashboard encountered a critical rendering error.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-black/50 p-4 rounded-md border border-red-500/20 text-xs text-red-300 font-mono overflow-auto max-h-60">
            <p className="font-bold mb-2 text-red-400">Error Message:</p>
            <p className="mb-4">{error.message || 'Unknown error'}</p>
            
            {error.digest && (
              <p className="opacity-70 mb-2">Digest: {error.digest}</p>
            )}

            {error.stack && (
              <>
                <p className="font-bold mb-2 text-red-400">Stack Trace:</p>
                <div className="whitespace-pre-wrap opacity-70">
                  {error.stack}
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10"
          >
            <Home className="h-4 w-4 mr-2" />
            Return Base
          </Button>
          <Button 
            onClick={() => reset()}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reboot System
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
