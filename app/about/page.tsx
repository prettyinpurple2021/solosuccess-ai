"use client"

export const dynamic = 'force-dynamic'

import Link from "next/link"
import { ArrowLeft, Crown, Rocket, Heart, Flame, CheckCircle} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <p>About Page Test with icons</p>
      <Crown />
    </div>
  )
}
