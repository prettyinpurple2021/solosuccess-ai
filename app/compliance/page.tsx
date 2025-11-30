"use client"

export const dynamic = 'force-dynamic'
import Link from "next/link"
import { ArrowLeft, Shield, CheckCircle, FileText, Lock, Globe, Users, AlertTriangle } from "lucide-react"
import { TacticalLink } from "@/components/military/TacticalLink"
import { GlassCard } from "@/components/military/GlassCard"
import { CamoBackground } from "@/components/military/CamoBackground"
import { SergeantDivider } from "@/components/military/SergeantDivider"
import { RankStars } from "@/components/military/RankStars"
import { motion } from "framer-motion"

const complianceStandards = [
  {
    icon: Shield,
    title: "GDPR Compliance",
    description: "Full compliance with the General Data Protection Regulation (GDPR) for European users",
    status: "Certified",
    details: "We implement data protection by design and by default, ensuring user rights including access, rectification, erasure, and data portability."
  },
  {
    icon: Lock,
    title: "CCPA Compliance",
    description: "California Consumer Privacy Act compliance for California residents",
    status: "Certified",
    details: "Users have the right to know what personal information is collected, sold, or disclosed, and can opt-out of the sale of personal information."
  },
  {
    icon: Globe,
    title: "SOC 2 Type II",
    description: "Service Organization Control 2 Type II certification for security and availability",
    status: "Certified",
    details: "Regular audits ensure our security controls, availability, processing integrity, confidentiality, and privacy meet the highest standards."
  },
  {
    icon: FileText,
    title: "ISO 27001",
    description: "Information Security Management System certification",
    status: "In Progress",
    details: "We are working towards ISO 27001 certification to further strengthen our information security management system."
  },
  {
    icon: Users,
    title: "HIPAA Ready",
    description: "Health Insurance Portability and Accountability Act readiness for healthcare data",
    status: "Available",
    details: "Our infrastructure and processes are designed to support HIPAA compliance for healthcare-related use cases."
  }
]

const dataRights = [
  {
    title: "Right to Access",
    description: "You have the right to request access to your personal data that we hold."
  },
  {
    title: "Right to Rectification",
    description: "You can request correction of inaccurate or incomplete personal data."
  },
  {
    title: "Right to Erasure",
    description: "You can request deletion of your personal data under certain circumstances."
  },
  {
    title: "Right to Data Portability",
    description: "You can request your data in a structured, commonly used format."
  },
  {
    title: "Right to Object",
    description: "You can object to processing of your personal data for certain purposes."
  },
  {
    title: "Right to Restrict Processing",
    description: "You can request restriction of processing your personal data."
  }
]

export default function CompliancePage() {
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
                <Shield className="w-5 h-5 text-military-hot-pink" />
                <span className="text-tactical">Compliance & Regulatory</span>
                <RankStars count={5} size="sm" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-hero mb-8"
              >
                <span className="gradient-text">
                  COMPLIANCE
                </span>
                <br />
                <span className="text-4xl md:text-6xl lg:text-7xl text-military-glass-white">
                  & REGULATORY STANDARDS 🛡️
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl text-military-storm-grey leading-relaxed mb-12 max-w-3xl mx-auto font-body"
              >
                SoloSuccess AI is committed to maintaining the highest standards of data protection, security, and regulatory compliance. We build trust through transparency and adherence to global compliance frameworks.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <SergeantDivider />

        {/* Compliance Standards */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-heading-1 gradient-text mb-4">COMPLIANCE STANDARDS</h2>
              <p className="text-lg text-military-storm-grey max-w-2xl mx-auto">
                We maintain compliance with major international and regional regulations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {complianceStandards.map((standard, index) => (
                <GlassCard key={index} variant="tactical" withShine className="p-6 h-full">
                  <div className="flex flex-col gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-military-hot-pink/20 to-military-blush-pink/20 border-2 border-military-hot-pink/30 flex items-center justify-center text-military-hot-pink">
                      <standard.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-heading-2 text-military-glass-white">{standard.title}</h3>
                        {standard.status === "Certified" && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                        {standard.status === "In Progress" && (
                          <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-military-storm-grey mb-3">{standard.description}</p>
                      <p className="text-sm text-military-storm-grey/80">{standard.details}</p>
                    </div>
                    <div className="mt-auto">
                      <span className="text-xs font-tactical text-military-hot-pink px-3 py-1 rounded-full bg-military-hot-pink/10 border border-military-hot-pink/30">
                        {standard.status}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        <SergeantDivider />

        {/* Data Rights */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-heading-1 gradient-text mb-4">YOUR DATA RIGHTS</h2>
              <p className="text-lg text-military-storm-grey max-w-2xl mx-auto">
                Under GDPR, CCPA, and other privacy regulations, you have specific rights regarding your personal data
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {dataRights.map((right, index) => (
                <GlassCard key={index} variant="default" withChevron className="p-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-heading-3 text-military-glass-white">{right.title}</h3>
                    <p className="text-military-storm-grey text-sm">{right.description}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        <SergeantDivider />

        {/* Security Measures */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <GlassCard variant="strong" className="p-12 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-heading-1 gradient-text mb-4">SECURITY MEASURES</h2>
                <p className="text-lg text-military-storm-grey">
                  We implement comprehensive security measures to protect your data
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-heading-3 text-military-glass-white mb-1">Encryption</h3>
                      <p className="text-military-storm-grey text-sm">AES-256 encryption for data at rest and TLS 1.3 for data in transit</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-heading-3 text-military-glass-white mb-1">Access Controls</h3>
                      <p className="text-military-storm-grey text-sm">Role-based access controls and multi-factor authentication</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-heading-3 text-military-glass-white mb-1">Regular Audits</h3>
                      <p className="text-military-storm-grey text-sm">Regular security audits and penetration testing</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-heading-3 text-military-glass-white mb-1">Data Backup</h3>
                      <p className="text-military-storm-grey text-sm">Automated backups with redundant storage across multiple regions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-heading-3 text-military-glass-white mb-1">Incident Response</h3>
                      <p className="text-military-storm-grey text-sm">24/7 monitoring and rapid incident response procedures</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-heading-3 text-military-glass-white mb-1">Privacy by Design</h3>
                      <p className="text-military-storm-grey text-sm">Privacy considerations built into every aspect of our platform</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        <SergeantDivider />

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <GlassCard variant="strong" className="p-12 text-center max-w-4xl mx-auto">
              <h2 className="text-heading-1 gradient-text mb-6">QUESTIONS ABOUT COMPLIANCE?</h2>
              <p className="text-xl text-military-storm-grey mb-8 max-w-2xl mx-auto">
                Our compliance team is here to help. Contact us with any questions about our compliance practices or to exercise your data rights.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <TacticalLink href="/contact" variant="primary" size="lg" withShine>
                  <Shield className="w-5 h-5" />
                  Contact Compliance Team
                </TacticalLink>
                <TacticalLink href="/privacy" variant="ghost" size="lg">
                  <FileText className="w-5 h-5" />
                  Privacy Policy
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

