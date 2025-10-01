import Link from "next/link"
import { ArrowLeft, Crown} from "lucide-react"
import { Button} from "@/components/ui/button"

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic'
// Edge Runtime disabled due to Node.js dependency incompatibility

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="w-full max-w-3xl text-center">
        {/* SoloSuccess Crown Logo */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-purple-100 rounded-full">
            <Crown className="h-12 w-12 text-purple-600" />
          </div>
        </div>

        {/* 404 Typography */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
          <p className="text-gray-600">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 max-w-md mx-auto">
          <Button asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/dashboard">
              <Crown className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>

        {/* Smart Links */}
        <div className="mt-10 text-left">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular destinations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link href="/pricing" className="rounded-lg border p-4 hover:shadow bg-white">
              <div className="font-medium text-purple-700">Pricing</div>
              <div className="text-sm text-gray-600">See plans for Solo Founders and Small Business Owners</div>
            </Link>
            <Link href="/pricing/launch" className="rounded-lg border p-4 hover:shadow bg-white">
              <div className="font-medium text-purple-700">Launch (Free)</div>
              <div className="text-sm text-gray-600">Start free with AI Business Assistant</div>
            </Link>
            <Link href="/blog" className="rounded-lg border p-4 hover:shadow bg-white">
              <div className="font-medium text-purple-700">Boss Blog</div>
              <div className="text-sm text-gray-600">Guides on automation, marketing, and growth</div>
            </Link>
            <Link href="/features" className="rounded-lg border p-4 hover:shadow bg-white">
              <div className="font-medium text-purple-700">Features</div>
              <div className="text-sm text-gray-600">Explore your virtual AI team</div>
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-sm text-gray-500">
          Need help? <Link href="/contact" className="text-purple-600 hover:underline">Contact support</Link>
        </p>
      </div>
    </div>
  )
}