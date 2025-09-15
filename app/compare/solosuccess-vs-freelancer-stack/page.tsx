"use client"

import Link from "next/link"

export default function CompareFreelancerStackPage() {
  const rows = [
    { feature: "One‑Person Business Software", ss: "Unified", other: "Multiple tools" },
    { feature: "AI for Social Media", ss: "Built‑in", other: "Manual / plugins" },
    { feature: "Automated Content Creation", ss: "Templates + agents", other: "DIY" },
    { feature: "Business Intelligence Tools", ss: "Out‑of‑the‑box", other: "Spreadsheets" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          SoloSuccess AI vs Freelancer Tool Stack
        </h1>
        <p className="text-lg text-gray-600 mb-8">Save time and context switching with a unified solo operating system.</p>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-gray-800">
            <thead className="bg-purple-50">
              <tr>
                <th className="p-4">Capability</th>
                <th className="p-4">SoloSuccess AI</th>
                <th className="p-4">Typical Stack</th>
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
          Explore {" "}
          <Link href="/pricing/accelerator" className="text-purple-600 underline">Accelerator</Link> or {" "}
          <Link href="/pricing/dominator" className="text-purple-600 underline">Dominator</Link>.
        </div>
      </div>
    </div>
  )
}


