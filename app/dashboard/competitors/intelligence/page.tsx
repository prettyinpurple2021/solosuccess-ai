"use client"

import React, { useState, useEffect, useCallback } from "react"

// Force dynamic rendering to avoid prerender errors
export const dynamic = 'force-dynamic'

export default function CompetitorIntelligencePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Competitor Intelligence</h1>
      <p className="text-gray-600">Intelligence dashboard coming soon...</p>
    </div>
  )
}
