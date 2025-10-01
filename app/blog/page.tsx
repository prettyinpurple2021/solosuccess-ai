"use client"


export const dynamic = 'force-dynamic'
import Link from "next/link"
import React, { useState } from "react"
import { ArrowLeft, Crown, Calendar, BookOpen, Sparkles, Bell, Mail} from "lucide-react"
import { Button} from "@/components/ui/button"
import { Card, CardContent} from "@/components/ui/card"
import { Badge} from "@/components/ui/badge"

// Edge Runtime disabled due to Node.js dependency incompatibility

export default function BlogComingSoonPage() {
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const submitNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || submitting) return
    setSubmitting(true)
    setMessage("")
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'blog_hero' }),
      })
      if (res.ok) {
        setMessage("You're on the list! 🎉")
        setEmail("")
      } else {
        const data = await res.json().catch(() => ({}))
        setMessage(data.error || 'Something went wrong. Try again.')
      }
    } catch {
      setMessage('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
                <div className="text-2xl">👑</div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  SoloSuccess AI
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-semibold px-6 py-2 rounded-full">
                Start Building Empire
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <Badge className="mb-6 text-lg px-6 py-2 bg-purple-100 text-purple-700 border-purple-200 rounded-full">
            📝 Boss Blog Coming Soon
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              The Boss Blog
            </span>
            <br />
            <span className="text-gray-600 text-3xl md:text-4xl">is Almost Here!</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Actionable playbooks on <strong>Business Automation</strong>, <strong>Strategic Planning Tools</strong>, and how to
            <strong> Streamline Operations</strong> as a <strong>Solo Founder</strong>, <strong>Solopreneur</strong>, or
            <strong> Small Business Owner</strong>. We cover <strong>AI-powered Productivity</strong> for
            <strong> Freelancers</strong>, <strong>Consultants</strong>, and the <strong>Individual Creator</strong>.
          </p>
          
          {/* Launch Date */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl max-w-md mx-auto mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-6 h-6" />
              <span className="text-lg font-semibold">Official Launch Date</span>
            </div>
            <div className="text-3xl font-bold">September 1, 2025</div>
          </div>

          {/* Hero Newsletter */}
          <form onSubmit={submitNewsletter} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email to get updates"
              required
              className="flex-1 rounded-lg border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
            />
            <Button type="submit" disabled={submitting || !email} className="px-6">
              {submitting ? 'Subscribing…' : 'Subscribe'}
            </Button>
          </form>
          {message && <div className="text-sm text-gray-700 mt-2">{message}</div>}
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What to Expect</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to <strong>Scale a Solo Business</strong>, <strong>Reduce Context Switching</strong>, and
              <strong> Overcome Decision Fatigue</strong> with practical systems and founder‑friendly frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-purple-200 hover:border-purple-300 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Empire Building Strategies</h3>
                <p className="text-gray-600">
                  Deep dives on <strong>How to Grow a Business Alone</strong> using automation, delegation to AI, and sustainable pace.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 hover:border-purple-300 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">AI Productivity Hacks</h3>
                <p className="text-gray-600">
                  Practical <strong>Workflow Automation AI</strong> tutorials, <strong>AI Executive Assistant</strong> routines, and
                  <strong> Business Intelligence Tools</strong> you can copy‑paste.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 hover:border-purple-300 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Marketing & Growth Systems</h3>
                <p className="text-gray-600">
                  Systems for <strong>Automated Content Creation</strong>, <strong>AI for Social Media</strong>, and
                  <strong> AI Marketing Assistant</strong> + <strong>AI Sales Strategist</strong> playbooks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Get Notified */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Be the First to Know</h2>
          <p className="text-xl text-gray-600 mb-8">
            Want to be notified when the Boss Blog launches? Join our newsletter and be the first to read our empire-building content!
          </p>
          
          <Card className="max-w-2xl mx-auto shadow-lg border-0">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Bell className="w-6 h-6 text-purple-600" />
                <h3 className="text-2xl font-bold text-gray-800">Launch Notification</h3>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <p className="text-gray-600 mb-4">
                  You&apos;ll automatically get notified about the Boss Blog launch when you subscribe to our newsletter below! 
                  Plus, you&apos;ll get exclusive early access to our best content.
                </p>
                <div className="flex items-center justify-center gap-2 text-purple-600 font-semibold">
                  <Mail className="w-5 h-5" />
                  <span>Newsletter subscribers get first access! 👇</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Blog Preview Topics */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Sneak Peek: Upcoming Topics</h2>
            <p className="text-xl text-gray-600">
              Here&apos;s what we&apos;re already working on for you, boss! 📝
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                &quot;From Solo to Squad: Building Your First AI Team&quot;
              </h3>
              <p className="text-gray-600 text-sm">
                A complete guide to getting started with AI agents and building your virtual team from scratch.
              </p>
              <div className="mt-3 text-sm">
                <span className="text-gray-500 mr-2">Related:</span>
                <Link href="/blog/how-to-scale-a-solo-business" className="text-purple-600 underline">Scale a Solo Business</Link>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                &quot;The Anti-Hustle Manifesto: Building Without Burning Out&quot;
              </h3>
              <p className="text-gray-600 text-sm">
                Why the &quot;hustle till you die&quot; mentality is killing entrepreneurs and how to build sustainably.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                &quot;Revenue Automation: 5 AI Systems That Made Me $100K&quot;
              </h3>
              <p className="text-gray-600 text-sm">
                Real case study of revenue-generating automation systems you can implement today.
              </p>
              <div className="mt-3 text-sm">
                <span className="text-gray-500 mr-2">Related:</span>
                <Link href="/blog/how-to-automate-revenue-workflows" className="text-purple-600 underline">Automate Revenue Workflows</Link>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                &quot;The Solo Entrepreneur&apos;s Guide to Mental Health&quot;
              </h3>
              <p className="text-gray-600 text-sm">
                Practical strategies for maintaining mental wellness while building your empire.
              </p>
              <div className="mt-3 text-sm">
                <span className="text-gray-500 mr-2">Related:</span>
                <Link href="/blog/how-to-build-marketing-system-with-ai" className="text-purple-600 underline">AI Marketing System</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Building?</h2>
          <p className="text-xl mb-8 opacity-90">
            While you wait for the Boss Blog, start building your empire with SoloSuccess AI today!
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Link href="/">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-full transform hover:scale-105 transition-all duration-200"
              >
                Start Your Empire
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold px-8 py-4 rounded-full transform hover:scale-105 transition-all duration-200 bg-transparent"
              >
                Get Updates
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 