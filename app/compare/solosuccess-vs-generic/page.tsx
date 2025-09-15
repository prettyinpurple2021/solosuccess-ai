"use client"

import Link from "next/link"

export default function CompareGenericPage() {
  const rows = [
    { feature: "AI Co‑founder & Co‑pilot", ss: "Included", other: "Limited / none" },
    { feature: "Workflow Automation AI", ss: "Built‑in", other: "Add‑ons" },
    { feature: "Founder AI Tools", ss: "Curated", other: "Generic" },
    { feature: "Pricing for Solo", ss: "Launch (Free)", other: "Trials only" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          SoloSuccess AI vs Generic All‑in‑One
        </h1>
        <p className="text-lg text-gray-600 mb-8">Designed for solo founders, with opinionated systems that reduce decision fatigue.</p>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-gray-800">
            <thead className="bg-purple-50">
              <tr>
                <th className="p-4">Feature</th>
                <th className="p-4">SoloSuccess AI</th>
                <th className="p-4">Generic Tool</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.feature} className="border-t">
                  <td className="p-4">{r.feature}</td>
                  <td className="p-4 text-green-700 font-medium">{r.ss}</td>
                  <td className="p-4 text-gray-600">{r.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-gray-700">
          Ready to start? Check the {" "}
          <Link href="/pricing/launch" className="text-purple-600 underline">Launch (Free)</Link> plan.
        </div>
      </div>
    </div>
  )
}


