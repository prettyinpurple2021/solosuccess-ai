"use client"

export const dynamic = 'force-dynamic'

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Crown, 
  Shield, 
  FileText, 
  Lock, 
  Eye, 
  Database,
  Target,
  Users,
  Zap,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Star
} from "lucide-react"
import { 
  TacticalButton, 
  GlassCard, 
  RankStars, 
  CamoBackground, 
  SergeantDivider,
  StatsBadge,
  TacticalGrid,
  TacticalGridItem
} from '@/components/military'

export default function PrivacyPolicyPage() {
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
                <Link href="/signin">
                  <TacticalButton variant="outline" size="sm">
                    Sign In
                  </TacticalButton>
                </Link>
                <Link href="/signup">
                  <TacticalButton size="sm">
                    Get Started
                  </TacticalButton>
                </Link>
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
                  Elite Security Protocol
                </span>
              </div>
              
              <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Policy</span>
              </h1>
              
              <p className="text-xl text-military-storm-grey mb-8 max-w-3xl mx-auto leading-relaxed">
                Your data security is our mission. Learn how we protect your business intelligence 
                with military-grade privacy protocols and elite data protection standards.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <TacticalButton size="lg" className="group">
                  Read Full Policy
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </TacticalButton>
                <TacticalButton variant="outline" size="lg">
                  Contact Security Team
                </TacticalButton>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Security Overview */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl font-bold text-white mb-4">
                Elite Security Standards
              </h2>
              <p className="text-xl text-military-storm-grey max-w-2xl mx-auto">
                Military-grade protection for your most valuable business data
              </p>
            </div>
            
            <TacticalGrid className="max-w-6xl mx-auto">
              <TacticalGridItem>
                <GlassCard className="h-full p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-4">End-to-End Encryption</h3>
                  <p className="text-military-storm-grey leading-relaxed">
                    All data is encrypted using AES-256 encryption both in transit and at rest. 
                    Your business intelligence is protected with military-grade security.
                  </p>
                </GlassCard>
              </TacticalGridItem>
              
              <TacticalGridItem>
                <GlassCard className="h-full p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-4">Zero-Knowledge Architecture</h3>
                  <p className="text-military-storm-grey leading-relaxed">
                    We cannot access your encrypted data. Only you hold the keys to your business 
                    intelligence and strategic information.
                  </p>
                </GlassCard>
              </TacticalGridItem>
              
              <TacticalGridItem>
                <GlassCard className="h-full p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-4">Secure Infrastructure</h3>
                  <p className="text-military-storm-grey leading-relaxed">
                    Our infrastructure is built on enterprise-grade cloud platforms with 
                    SOC 2 Type II compliance and regular security audits.
                  </p>
                </GlassCard>
              </TacticalGridItem>
              
              <TacticalGridItem>
                <GlassCard className="h-full p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-4">Privacy by Design</h3>
                  <p className="text-military-storm-grey leading-relaxed">
                    Privacy is built into every aspect of our platform. We collect only what's 
                    necessary and never sell your data to third parties.
                  </p>
                </GlassCard>
              </TacticalGridItem>
            </TacticalGrid>
          </div>
        </section>

        {/* Data Collection */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading text-4xl font-bold text-white mb-4">
                  Data Collection & Usage
                </h2>
                <p className="text-xl text-military-storm-grey">
                  Transparent information about how we handle your data
                </p>
              </div>
              
              <GlassCard className="p-12">
                <div className="space-y-8">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      Information We Collect
                    </h3>
                    <div className="space-y-4 text-military-storm-grey">
                      <p><strong className="text-white">Account Information:</strong> Name, email, and business details to provide personalized service</p>
                      <p><strong className="text-white">Usage Data:</strong> How you interact with our platform to improve your experience</p>
                      <p><strong className="text-white">Business Intelligence:</strong> Your business data to provide AI-powered insights and recommendations</p>
                      <p><strong className="text-white">Technical Data:</strong> Device information and usage patterns for security and optimization</p>
                    </div>
                  </div>
                  
                  <SergeantDivider />
                  
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <Target className="w-6 h-6 text-military-hot-pink" />
                      How We Use Your Data
                    </h3>
                    <div className="space-y-4 text-military-storm-grey">
                      <p><strong className="text-white">Service Delivery:</strong> To provide and improve our AI-powered business tools</p>
                      <p><strong className="text-white">Personalization:</strong> To customize your experience and recommendations</p>
                      <p><strong className="text-white">Security:</strong> To protect your account and detect unauthorized access</p>
                      <p><strong className="text-white">Communication:</strong> To send important updates and support messages</p>
                    </div>
                  </div>
                  
                  <SergeantDivider />
                  
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-4 flex items-center gap-3">
                      <Shield className="w-6 h-6 text-military-hot-pink" />
                      Data Protection Rights
                    </h3>
                    <div className="space-y-4 text-military-storm-grey">
                      <p><strong className="text-white">Access:</strong> Request a copy of all data we have about you</p>
                      <p><strong className="text-white">Correction:</strong> Update or correct any inaccurate information</p>
                      <p><strong className="text-white">Deletion:</strong> Request deletion of your personal data</p>
                      <p><strong className="text-white">Portability:</strong> Export your data in a machine-readable format</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl font-bold text-white mb-4">
                Elite Compliance Standards
              </h2>
              <p className="text-xl text-military-storm-grey">
                Meeting the highest international privacy and security standards
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">GDPR Compliant</h3>
                <p className="text-military-storm-grey text-sm">Full compliance with European data protection regulations</p>
              </GlassCard>
              
              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">SOC 2 Type II</h3>
                <p className="text-military-storm-grey text-sm">Audited security controls and operational procedures</p>
              </GlassCard>
              
              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">CCPA Compliant</h3>
                <p className="text-military-storm-grey text-sm">California Consumer Privacy Act compliance</p>
              </GlassCard>
              
              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">ISO 27001</h3>
                <p className="text-military-storm-grey text-sm">International information security management standard</p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Contact & Updates */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <GlassCard className="max-w-4xl mx-auto p-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="font-heading text-4xl font-bold text-white mb-6">
                  Privacy Questions?
                </h2>
                
                <p className="text-xl text-military-storm-grey mb-8 max-w-2xl mx-auto">
                  Our elite security team is available to answer any questions about our 
                  privacy practices and data protection measures.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/contact">
                    <TacticalButton size="lg" className="group">
                      Contact Security Team
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </TacticalButton>
                  </Link>
                  <Link href="/help">
                    <TacticalButton variant="outline" size="lg">
                      View Help Center
                    </TacticalButton>
                  </Link>
                </div>
                
                <div className="mt-8 pt-8 border-t border-military-hot-pink/30">
                  <p className="text-military-storm-grey text-sm">
                    Last updated: {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </motion.div>
            </GlassCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-military-hot-pink/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading text-lg font-bold text-white">SoloSuccess AI</span>
              </div>
              
              <div className="flex items-center gap-6 text-military-storm-grey">
                <Link href="/terms" className="hover:text-military-hot-pink transition-colors">Terms</Link>
                <Link href="/contact" className="hover:text-military-hot-pink transition-colors">Contact</Link>
                <Link href="/about" className="hover:text-military-hot-pink transition-colors">About</Link>
              </div>
            </div>
          </div>
        </footer>
      </CamoBackground>
    </div>
  )
}