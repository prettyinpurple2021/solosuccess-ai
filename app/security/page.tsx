"use client"

export const dynamic = 'force-dynamic'

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Crown, 
  Shield, 
  Lock, 
  Eye, 
  Server, 
  Key, 
  CheckCircle, 
  AlertTriangle,
  Target,
  Users,
  Zap,
  ArrowRight,
  FileText
} from "lucide-react"
import { 
  TacticalButton, 
  GlassCard, 
  RankStars, 
  CamoBackground, 
  SergeantDivider,
  StatsBadge,
  TacticalGrid,
  TacticalGridItem,
  TacticalLink
} from '@/components/military'

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All data is encrypted in transit and at rest using AES-256 encryption",
    status: "Active"
  },
  {
    icon: Shield,
    title: "SOC 2 Type II Compliant",
    description: "Regular security audits and compliance with industry standards",
    status: "Certified"
  },
  {
    icon: Key,
    title: "Zero-Knowledge Architecture",
    description: "We never have access to your unencrypted data or business information",
    status: "Active"
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description: "Hosted on enterprise-grade cloud infrastructure with 99.9% uptime",
    status: "Operational"
  },
  {
    icon: Eye,
    title: "Privacy by Design",
    description: "Built with privacy at the core - your data belongs to you",
    status: "Active"
  },
  {
    icon: Target,
    title: "Advanced Threat Detection",
    description: "Real-time monitoring and automated response to security threats",
    status: "Active"
  }
]

const certifications = [
  { name: "SOC 2 Type II", status: "Certified", icon: Shield },
  { name: "GDPR Compliant", status: "Certified", icon: FileText },
  { name: "CCPA Compliant", status: "Certified", icon: FileText },
  { name: "ISO 27001", status: "In Progress", icon: CheckCircle }
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-military-midnight relative overflow-hidden">
      <CamoBackground opacity={0.1} withGrid>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel-strong border-b border-military-hot-pink/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="flex items-center gap-3">
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Crown className="w-6 h-6 text-white" />
                </motion.div>
                <span className="font-heading text-xl font-bold text-white">SoloSuccess AI</span>
              </Link>
              
              <div className="flex items-center gap-4">
                <TacticalLink href="/privacy" variant="outline" size="sm">
                  Privacy Policy
                </TacticalLink>
                <TacticalLink href="/contact" variant="outline" size="sm">
                  Contact
                </TacticalLink>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <RankStars count={5} size="lg" />
                <span className="text-military-hot-pink font-tactical text-sm uppercase tracking-wider">
                  Enterprise Security
                </span>
              </div>
              
              <div className="flex items-center justify-center mb-6">
                <Shield className="w-20 h-20 text-military-hot-pink" />
              </div>
              
              <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Security & <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Trust</span> 🔒
              </h1>
              
              <p className="text-xl text-military-storm-grey mb-8 max-w-3xl mx-auto leading-relaxed">
                Your business data is precious. We protect it with enterprise-grade security 
                that meets the highest industry standards. Sleep soundly knowing your empire is secure! ✨
              </p>

              <GlassCard className="max-w-2xl mx-auto p-6 mb-8 border-military-hot-pink/30">
                <div className="flex items-center gap-3 justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-white font-tactical">
                    <strong>Last security audit:</strong> December 2024 - All systems secure ✅
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                How We Protect Your Data
              </h2>
              <p className="text-xl text-military-storm-grey max-w-3xl mx-auto">
                Multi-layered security approach ensuring your business information stays private and secure
              </p>
            </div>

            <TacticalGrid className="mb-16">
              {securityFeatures.map((feature, index) => (
                <TacticalGridItem key={index}>
                  <GlassCard className="p-8 h-full border-military-hot-pink/20 hover:border-military-hot-pink/40 transition-colors">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-military-hot-pink/20 to-military-blush-pink/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="w-8 h-8 text-military-hot-pink" />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-military-storm-grey mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      <StatsBadge variant="success" size="sm">
                        {feature.status}
                      </StatsBadge>
                    </div>
                  </GlassCard>
                </TacticalGridItem>
              ))}
            </TacticalGrid>

            <SergeantDivider className="my-16" />

            {/* Certifications */}
            <GlassCard className="max-w-5xl mx-auto p-12 border-military-hot-pink/30">
              <h3 className="font-heading text-3xl font-bold text-white text-center mb-12">
                Security Certifications & Compliance
              </h3>
              <TacticalGrid>
                {certifications.map((cert, index) => (
                  <TacticalGridItem key={index}>
                    <GlassCard className="p-6 text-center border-military-hot-pink/20">
                      <div className="flex items-center justify-center mb-4">
                        {cert.status === "Certified" ? (
                          <CheckCircle className="w-10 h-10 text-green-400" />
                        ) : (
                          <AlertTriangle className="w-10 h-10 text-yellow-400" />
                        )}
                      </div>
                      <div className="flex items-center justify-center mb-3">
                        <cert.icon className="w-6 h-6 text-military-hot-pink mr-2" />
                        <h4 className="font-heading font-bold text-white">{cert.name}</h4>
                      </div>
                      <StatsBadge 
                        variant={cert.status === "Certified" ? "success" : "warning"} 
                        size="sm"
                      >
                        {cert.status}
                      </StatsBadge>
                    </GlassCard>
                  </TacticalGridItem>
                ))}
              </TacticalGrid>
            </GlassCard>
          </div>
        </section>

        {/* Security Practices */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <TacticalGrid className="mb-16">
              <TacticalGridItem>
                <GlassCard className="p-8 border-military-hot-pink/20">
                  <h3 className="font-heading text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-military-hot-pink" />
                    Data Protection Practices
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Regular security audits and penetration testing",
                      "24/7 security monitoring and incident response",
                      "Employee security training and background checks",
                      "Secure development lifecycle (SDLC) practices",
                      "Regular security awareness training for all staff"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-military-storm-grey">{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </TacticalGridItem>
              
              <TacticalGridItem>
                <GlassCard className="p-8 border-military-hot-pink/20">
                  <h3 className="font-heading text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Server className="w-6 h-6 text-military-hot-pink" />
                    Infrastructure Security
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Multi-region data backups with 99.9% recovery guarantee",
                      "DDoS protection and advanced threat detection",
                      "Network segmentation and access controls",
                      "Automated security updates and patch management",
                      "Enterprise-grade firewalls and intrusion detection"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-military-storm-grey">{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </TacticalGridItem>
            </TacticalGrid>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <GlassCard className="max-w-4xl mx-auto p-12 text-center border-military-hot-pink/30">
              <h3 className="font-heading text-3xl font-bold text-white mb-6">
                Security Questions or Concerns?
              </h3>
              <p className="text-military-storm-grey mb-8 max-w-2xl mx-auto text-lg">
                Our security team is here to help. Whether you need technical documentation, 
                want to report a security issue, or have compliance questions - we&apos;re here for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <TacticalLink href="/contact" variant="primary" size="lg">
                  Contact Security Team
                  <ArrowRight className="ml-2 w-4 h-4" />
                </TacticalLink>
                <TacticalLink href="mailto:security@solosuccessai.fun" variant="outline" size="lg">
                  security@solosuccessai.fun
                </TacticalLink>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-military-hot-pink/20 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-military-storm-grey">
              © 2025 SoloSuccess AI. All rights reserved.
            </p>
          </div>
        </footer>
      </CamoBackground>
    </div>
  )
}