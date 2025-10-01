"use client"

import Script from "next/script"
import Link from "next/link"
import { ArrowLeft, ListChecks } from "lucide-react"

export const runtime = 'edge'

export default function HowToScaleSoloBusinessPage() {
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Scale a Solo Business",
    description:
      "A practical, step-by-step framework to scale a solo business using AI-powered Productivity, Business Automation, and Strategic Planning Tools.",
    step: [
      { "@type": "HowToStep", name: "Clarify outcomes", text: "Define 1-3 quarterly outcomes and success metrics." },
      { "@type": "HowToStep", name: "Map workflows", text: "List recurring tasks; identify where automation removes toil." },
      { "@type": "HowToStep", name: "Automate", text: "Implement Workflow Automation AI for capture, routing, and follow-ups." },
      { "@type": "HowToStep", name: "Measure", text: "Track leading indicators weekly and review pivots bi-weekly." },
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
          How to Scale a Solo Business
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Use this lean operating system to reduce context switching, overcome decision fatigue, and scale sustainably.
        </p>

        <div className="rounded-2xl border p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <ListChecks className="w-5 h-5 text-purple-600" />
            <h2 className="text-2xl font-semibold">Step-by-step</h2>
          </div>
          <ol className="list-decimal ml-6 space-y-3 text-gray-700">
            <li>Clarify quarterly outcomes tied to revenue, retention, or throughput.</li>
            <li>Map your weekly workflows and identify repetitive, rules-based tasks.</li>
            <li>Automate capture, routing, reminders, and status updates with AI agents.</li>
            <li>Implement a Friday review and a Monday plan ritual to stay aligned.</li>
          </ol>
        </div>
      </main>

      <Script id="howto-scale-solo-jsonld" type="application/ld+json">
        {JSON.stringify(howTo)}
      </Script>
    </div>
  )
}


