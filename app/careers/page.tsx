"use client"

export const dynamic = 'force-dynamic'
import Link from "next/link"
import { ArrowLeft, Shield, Briefcase, Users, Zap, Heart, TrendingUp, Star, Rocket, Target } from "lucide-react"
import { TacticalLink } from "@/components/military/TacticalLink"
import { GlassCard } from "@/components/military/GlassCard"
import { CamoBackground } from "@/components/military/CamoBackground"
import { SergeantDivider } from "@/components/military/SergeantDivider"
import { RankStars } from "@/components/military/RankStars"
import { motion } from "framer-motion"

const values = [
  {
    icon: Rocket,
    title: "Innovation First",
    description: "We push boundaries and embrace cutting-edge technology to solve real problems"
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We believe in the power of teamwork and diverse perspectives"
  },
  {
    icon: Heart,
    title: "User-Centric",
    description: "Everything we do is focused on delivering value to our users"
  },
  {
    icon: Zap,
    title: "Speed & Agility",
    description: "We move fast, iterate quickly, and adapt to changing needs"
  },
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for excellence in everything we do, from code to customer support"
  },
  {
    icon: TrendingUp,
    title: "Growth Mindset",
    description: "We're always learning, growing, and improving together"
  }
]

const benefits = [
  {
    title: "Competitive Compensation",
    description: "Market-competitive salaries and equity packages"
  },
  {
    title: "Remote-First Culture",
    description: "Work from anywhere in the world with flexible hours"
  },
  {
    title: "Health & Wellness",
    description: "Comprehensive health insurance and wellness programs"
  },
  {
    title: "Learning & Development",
    description: "Budget for courses, conferences, and professional development"
  },
  {
    title: "Unlimited PTO",
    description: "Take time off when you need it to recharge and stay productive"
  },
  {
    title: "Cutting-Edge Tools",
    description: "Best-in-class equipment and software to do your best work"
  }
]

const openPositions = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Build scalable, production-ready features using Next.js, TypeScript, and modern web technologies."
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Design beautiful, intuitive user experiences that empower solo entrepreneurs to build their empires."
  },
  {
    title: "AI/ML Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Develop and optimize AI agents and machine learning models to power our platform's intelligence."
  },
  {
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote",
    type: "Full-time",
    description: "Help users succeed by providing exceptional support and building strong relationships."
  },
  {
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "Drive user acquisition and growth through data-driven marketing strategies and campaigns."
  },
  {
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Ensure our infrastructure is scalable, secure, and reliable for our growing user base."
  }
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-military-midnight relative overflow-hidden">
      <CamoBackground opacity={0.15} withGrid>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel-strong border-b border-military-hot-pink/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="flex items-center gap-3">
                <ArrowLeft className="w-5 h-5 text-military-glass-white/90" />
                <div className="text-3xl font-heading font-bold gradient-text">
                  SOLOSUCCESS
                </div>
              </Link>
              <TacticalLink href="/signup" variant="primary" withShine>
                <Shield className="w-4 h-4" />
                Get Started
              </TacticalLink>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-3 stats-badge mb-8"
              >
                <Briefcase className="w-5 h-5 text-military-hot-pink" />
                <span className="text-tactical">Join Our Mission</span>
                <RankStars count={5} size="sm" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-hero mb-8"
              >
                <span className="gradient-text">
                  CAREERS
                </span>
                <br />
                <span className="text-4xl md:text-6xl lg:text-7xl text-military-glass-white">
                  BUILD THE FUTURE 🚀
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl text-military-storm-grey leading-relaxed mb-12 max-w-3xl mx-auto font-body"
              >
                Join a mission-driven team building AI-powered tools that help solo entrepreneurs scale their businesses. We're looking for talented individuals who share our passion for innovation and excellence.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <SergeantDivider />

        {/* Why Join Us */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-heading-1 gradient-text mb-4">WHY JOIN SOLOSUCCESS AI?</h2>
              <p className="text-lg text-military-storm-grey max-w-2xl mx-auto">
                We're building something special, and we want you to be part of it
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <GlassCard key={index} variant="tactical" withShine className="p-6 h-full">
                  <div className="flex flex-col gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-military-hot-pink/20 to-military-blush-pink/20 border-2 border-military-hot-pink/30 flex items-center justify-center text-military-hot-pink">
                      <value.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-heading-2 text-military-glass-white mb-2">{value.title}</h3>
                      <p className="text-military-storm-grey">{value.description}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        <SergeantDivider />

        {/* Benefits */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-heading-1 gradient-text mb-4">BENEFITS & PERKS</h2>
              <p className="text-lg text-military-storm-grey max-w-2xl mx-auto">
                We take care of our team so you can focus on doing your best work
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <GlassCard key={index} variant="default" withChevron className="p-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-heading-3 text-military-glass-white">{benefit.title}</h3>
                    <p className="text-military-storm-grey text-sm">{benefit.description}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        <SergeantDivider />

        {/* Open Positions */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-heading-1 gradient-text mb-4">OPEN POSITIONS</h2>
              <p className="text-lg text-military-storm-grey max-w-2xl mx-auto">
                We're always looking for talented people to join our team
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {openPositions.map((position, index) => (
                <GlassCard key={index} variant="tactical" withShine className="p-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-heading-2 text-military-glass-white mb-2">{position.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs font-tactical text-military-hot-pink px-3 py-1 rounded-full bg-military-hot-pink/10 border border-military-hot-pink/30">
                          {position.department}
                        </span>
                        <span className="text-xs font-tactical text-military-storm-grey px-3 py-1 rounded-full bg-military-gunmetal/30 border border-military-gunmetal/50">
                          {position.location}
                        </span>
                        <span className="text-xs font-tactical text-military-storm-grey px-3 py-1 rounded-full bg-military-gunmetal/30 border border-military-gunmetal/50">
                          {position.type}
                        </span>
                      </div>
                      <p className="text-military-storm-grey text-sm">{position.description}</p>
                    </div>
                    <TacticalLink href="/contact" variant="ghost" size="sm" className="mt-auto">
                      Apply Now
                    </TacticalLink>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        <SergeantDivider />

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <GlassCard variant="strong" className="p-12 text-center max-w-4xl mx-auto">
              <h2 className="text-heading-1 gradient-text mb-6">DON'T SEE A ROLE THAT FITS?</h2>
              <p className="text-xl text-military-storm-grey mb-8 max-w-2xl mx-auto">
                We're always interested in talking to talented people. Even if we don't have an opening that matches your skills right now, we'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <TacticalLink href="/contact" variant="primary" size="lg" withShine>
                  <Briefcase className="w-5 h-5" />
                  Get In Touch
                </TacticalLink>
                <TacticalLink href="/about" variant="ghost" size="lg">
                  <Users className="w-5 h-5" />
                  Learn More About Us
                </TacticalLink>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-military-gunmetal/30 py-12 glass-overlay-tactical">
          <div className="container mx-auto px-4">
            <div className="text-center text-sm text-military-storm-grey">
              <p>© 2025 SoloSuccess AI. All rights reserved. 🪖 Command Your Empire.</p>
            </div>
          </div>
        </footer>
      </CamoBackground>
    </div>
  )
}

