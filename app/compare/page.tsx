"use client"


export const dynamic = 'force-dynamic'
import Link from "next/link"

export default function CompareIndexPage() {
  const comparisons = [
    { title: "SoloSuccess AI vs Generic All‑in‑One", href: "/compare/solosuccess-vs-generic" },
    { title: "SoloSuccess AI vs Freelancer Tool Stack", href: "/compare/solosuccess-vs-freelancer-stack" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          Comparisons
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          See how SoloSuccess AI compares and choose the best fit for your solo business.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparisons.map((c) => (
            <Link key={c.href} href={c.href} className="block rounded-xl border p-6 hover:shadow transition-all">
              <div className="text-xl font-semibold text-purple-700 mb-2">{c.title}</div>
              <div className="text-gray-600">Feature breakdowns, pricing notes, and best‑fit recommendations.</div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-gray-700">
          Or explore our <Link href="/pricing" className="text-purple-600 underline">pricing</Link> and
          {" "}
          <Link href="/features" className="text-purple-600 underline">features</Link> directly.
        </div>
      </div>
    </div>
  )
}


