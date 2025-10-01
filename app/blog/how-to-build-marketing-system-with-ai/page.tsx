"use client"

import Script from "next/script"
import Link from "next/link"
import { ArrowLeft, Megaphone } from "lucide-react"

// Edge Runtime disabled due to Node.js dependency incompatibility

export default function HowToBuildMarketingSystemWithAIPage() {
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Build a Marketing System with AI",
    description:
      "Design an AI-powered marketing system for content, distribution, and feedback loops across channels.",
    step: [
      { "@type": "HowToStep", name: "Audience map", text: "Define ICP and pain points across buying stages." },
      { "@type": "HowToStep", name: "Content engine", text: "Automated briefs, drafts, and repurposing across formats." },
      { "@type": "HowToStep", name: "Distribution", text: "Schedule multi-channel posts and listen for signals." },
      { "@type": "HowToStep", name: "Feedback loop", text: "Weekly insights inform next sprint topics." },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b bg-white/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/blog" className="text-gray-700 hover:text-purple-600 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          How to Build a Marketing System with AI
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Ship consistent content, automate distribution, and learn from engagement to grow faster.
        </p>

        <div className="rounded-2xl border p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Megaphone className="w-5 h-5 text-purple-600" />
            <h2 className="text-2xl font-semibold">Blueprint</h2>
          </div>
          <ul className="list-disc ml-6 space-y-3 text-gray-700">
            <li>Topic backlog linked to product roadmap</li>
            <li>AI briefs and drafts with editorial review</li>
            <li>Automatic repurposing into short, image, and long forms</li>
            <li>Weekly growth review and next sprint planning</li>
          </ul>
        </div>
      </main>

      <Script id="howto-marketing-jsonld" type="application/ld+json">
        {JSON.stringify(howTo)}
      </Script>
    </div>
  )
}


