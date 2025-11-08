"use client"

export const dynamic = 'force-dynamic'

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Crown, Scale, FileText, ArrowRight } from "lucide-react"
import { 
  TacticalButton, 
  GlassCard, 
  RankStars, 
  CamoBackground, 
  SergeantDivider,
  StatsBadge,
  TacticalLink
} from '@/components/military'

export default function TermsOfServicePage() {
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
                <TacticalLink href="/signup" variant="primary" size="sm">
                  Start Building Empire
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
                  ⚖️ Legal Framework
                </span>
              </div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-military-hot-pink/20 to-military-blush-pink/20 flex items-center justify-center">
                  <Scale className="w-10 h-10 text-military-hot-pink" />
                </div>
              </div>
              
              <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Service</span>
              </h1>
              
              <p className="text-xl text-military-storm-grey mb-8 max-w-3xl mx-auto leading-relaxed">
                Building empires requires clear foundations. Here are the terms that govern your journey with SoloSuccess AI.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-military-storm-grey">
                <FileText className="w-4 h-4" />
                <span>Effective Date: July 30th, 2025</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <GlassCard className="max-w-4xl mx-auto p-8 md:p-12 border-military-hot-pink/30">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-military-hot-pink/20">
                <Crown className="w-6 h-6 text-military-hot-pink" />
                <h2 className="font-heading text-2xl font-bold text-white">
                  SoloSuccess AI Terms of Service
                </h2>
              </div>
              
              <div className="prose prose-lg max-w-none">
                {/* Section 1 */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-military-hot-pink/20 text-military-hot-pink flex items-center justify-center text-sm font-bold">1</span>
                    Introduction and Acceptance of Terms
                  </h2>
                  <p className="text-military-storm-grey leading-relaxed mb-4">
                    Welcome to SoloSuccess AI! SoloSuccess AI is an innovative web application designed to be an AI-driven productivity platform for solo entrepreneurs, freelancers, and small business owners. Our purpose is to provide a highly valuable, feature-rich, and production-ready platform that simulates a "virtual team experience," enabling independent professionals to streamline operations, enhance productivity, and scale their businesses without the need for traditional hiring.
                  </p>
                  <p className="text-military-storm-grey leading-relaxed">
                    By accessing or using the SoloSuccess AI web application and its services (collectively, the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Service.
                  </p>
                </div>

                <SergeantDivider className="my-8" />

                {/* Section 2 */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-military-hot-pink/20 text-military-hot-pink flex items-center justify-center text-sm font-bold">2</span>
                    Your SoloSuccess AI Account
                  </h2>
                  <p className="text-military-storm-grey leading-relaxed mb-4">
                    To access most features of SoloSuccess AI, you must register for an account.
                  </p>
                  <GlassCard className="p-4 mb-4 border-military-hot-pink/20">
                    <h3 className="font-semibold text-white mb-2">Account Creation:</h3>
                    <p className="text-military-storm-grey text-sm">
                      The system allows new users to register for a SoloSuccess AI account using our custom authentication system, which handles secure password hashing and creates a user record.
                    </p>
                  </GlassCard>
                  <GlassCard className="p-4 mb-4 border-military-blush-pink/20">
                    <h3 className="font-semibold text-white mb-2">Account Information:</h3>
                    <p className="text-military-storm-grey text-sm">
                      You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                    </p>
                  </GlassCard>
                  <GlassCard className="p-4 border-military-hot-pink/20">
                    <h3 className="font-semibold text-white mb-2">Account Security:</h3>
                    <p className="text-military-storm-grey text-sm">
                      You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account. The system uses our custom authentication to authenticate credentials and establish a secure user session. You can view and edit your basic profile information, which is retrieved from the users table in the Neon PostgreSQL database.
                    </p>
                  </GlassCard>
                </div>

                <SergeantDivider className="my-8" />

                {/* Section 3 */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-military-hot-pink/20 text-military-hot-pink flex items-center justify-center text-sm font-bold">3</span>
                    Subscription Plans and Payments
                  </h2>
                  <p className="text-military-storm-grey leading-relaxed mb-4">
                    SoloSuccess AI offers a tiered subscription model to cater to different user needs.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-white mb-3">Product Tiers:</h3>
                  
                  <div className="grid gap-4 mb-6">
                    <GlassCard className="p-4 border-blue-400/20 border-l-4 border-blue-400">
                      <h4 className="font-semibold text-white mb-2">Launch (Free):</h4>
                      <p className="text-military-storm-grey text-sm">
                        This tier provides a basic entry point with access to 2 AI agents and 5 daily conversations. It is available at no cost monthly or yearly.
                      </p>
                    </GlassCard>
                    
                    <GlassCard className="p-4 border-military-hot-pink/20 border-l-4 border-purple-400">
                      <h4 className="font-semibold text-white mb-2">Accelerator (Pro):</h4>
                      <p className="text-military-storm-grey text-sm">
                        This tier offers enhanced capabilities, including access to 5 AI Agents, advanced automation workflows, and priority support. It is priced at $19 per month or $190 per year.
                      </p>
                    </GlassCard>
                    
                    <GlassCard className="p-4 border-military-blush-pink/20 border-l-4 border-pink-400">
                      <h4 className="font-semibold text-white mb-2">Dominator (Empire):</h4>
                      <p className="text-military-storm-grey text-sm">
                        This tier provides the most comprehensive features for advanced users, with unrestricted access to all current and future premium functionalities. Pricing for this tier is $29 per month or $290 per year.
                      </p>
                    </GlassCard>
                  </div>

                  <GlassCard className="p-4 border-military-storm-grey/20 mb-4">
                    <h3 className="font-semibold text-white mb-2">Subscription Plans:</h3>
                    <p className="text-military-storm-grey text-sm mb-2">
                      The platform offers subscription tiers: Launch ($0), Accelerator ($19/month or $190/year), and Dominator ($29/month or $290/year) plans with different feature sets and AI agent access levels.
                    </p>
                    <p className="text-military-storm-grey text-sm">
                      Payment processing is handled securely through Stripe. All subscriptions are billed automatically on a monthly or annual basis depending on your selection. You can upgrade, downgrade, or cancel your subscription at any time through your account settings.
                    </p>
                  </GlassCard>
  
                  <GlassCard className="p-4 border-military-storm-grey/20">
                    <h3 className="font-semibold text-white mb-2">Feature Access:</h3>
                    <p className="text-military-storm-grey text-sm">
                      Access to features and AI agents is strictly enforced based on your subscription tier. Launch tier users have access to 2 AI agents and 5 daily conversations. Accelerator users get 5 agents and 100 daily conversations. Dominator users have unlimited access to all 8 agents with no conversation limits. Usage limits reset daily and are tracked in real-time.
                    </p>
                  </GlassCard>
                </div>

                <SergeantDivider className="my-8" />

                {/* Section 4 */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-military-hot-pink/20 text-military-hot-pink flex items-center justify-center text-sm font-bold">4</span>
                    Intellectual Property Rights
                  </h2>
                  <p className="text-military-storm-grey leading-relaxed mb-4">
                    All rights reserved. This project is proprietary software developed for SoloSuccess AI Platform.
                  </p>
                  
                  <GlassCard className="p-4 border-yellow-400/20 mb-4 border-l-4 border-yellow-400">
                    <h3 className="font-semibold text-white mb-2">Ownership:</h3>
                    <p className="text-military-storm-grey text-sm">
                      SoloSuccess AI and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof), are owned by SoloSuccess AI, its licensors, or other providers of such material. This includes the distinct brand identity, brand name "SoloSuccess", tagline "Be the Boss. Build Solo. Rule Your Empire.&quot;, brand voice (e.g., Confident, Empowering, Rebellious with purpose), brand personality (e.g., Punk Rock meets Girlboss CEO, Energetic, creative, driven), brand aesthetic (e.g., Vibrant Purple, Teal, Hot Pink, paint splatter, shimmer/glitter overlays, cute skulls with bows), and the distinct personalities and roles of the 8 AI Agents (Roxy, Blaze, Echo, Lumi, Vex, Lexi, Nova, Glitch).
                    </p>
                  </GlassCard>

                  <GlassCard className="p-4 border-green-400/20 mb-4 border-l-4 border-green-400">
                    <h3 className="font-semibold text-white mb-2">Limited License:</h3>
                    <p className="text-military-storm-grey text-sm">
                      These Terms of Service grant you a limited, non-exclusive, non-transferable, revocable license to use the Service solely for your personal and business use, in accordance with these Terms.
                    </p>
                  </GlassCard>

                  <GlassCard className="p-4 border-red-400/20 border-l-4 border-red-400">
                    <h3 className="font-semibold text-white mb-2">Restrictions:</h3>
                    <p className="text-military-storm-grey text-sm mb-2">
                      You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service, except as generally permitted through your use of the Service. You must not:
                    </p>
                    <ul className="text-military-storm-grey text-sm list-disc list-inside space-y-1">
                      <li>Modify copies of any materials from this site.</li>
                      <li>Use any illustrations, photographs, video or audio sequences, or any graphics separately from the accompanying text.</li>
                      <li>Delete or alter any copyright, trademark, or other proprietary rights notices from copies of materials from this site.</li>
                      <li>Introduce new libraries or frameworks without team approval for the underlying platform.</li>
                    </ul>
                  </GlassCard>
                </div>

                <SergeantDivider className="my-8" />

                {/* Continue with remaining sections... */}
                {/* Section 5 */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-military-hot-pink/20 text-military-hot-pink flex items-center justify-center text-sm font-bold">5</span>
                    User-Generated Content
                  </h2>
                  
                  <GlassCard className="p-4 border-blue-400/20 mb-4">
                    <h3 className="font-semibold text-white mb-2">Your Content:</h3>
                    <p className="text-military-storm-grey text-sm">
                      The Service allows you to input and generate content, such as SlayList goals and tasks, Briefcase files, Brand Profiles (color palettes, font combinations), and interactions with AI agents (inputs and outputs). You retain all rights in and to your User-Generated Content.
                    </p>
                  </GlassCard>

                  <GlassCard className="p-4 border-military-hot-pink/20 mb-4">
                    <h3 className="font-semibold text-white mb-2">License to SoloSuccess AI:</h3>
                    <p className="text-military-storm-grey text-sm">
                      By submitting, posting, or displaying User-Generated Content on or through the Service, you grant SoloSuccess AI a worldwide, non-exclusive, royalty-free license (with the right to sublicense) to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such content in any and all media or distribution methods (now known or later developed) for the sole purpose of providing and improving the Service to you. This includes, for example, AI agents accessing your Brand Profile to generate on-brand content or Lexi analyzing SlayList data to provide insights.
                    </p>
                  </GlassCard>

                  <GlassCard className="p-4 border-military-blush-pink/20">
                    <h3 className="font-semibold text-white mb-2">Responsibility for Content:</h3>
                    <p className="text-military-storm-grey text-sm">
                      You are solely responsible for your User-Generated Content and the consequences of submitting and publishing your content on the Service.
                    </p>
                  </GlassCard>
                </div>

                <SergeantDivider className="my-8" />

                {/* Section 6 */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-military-hot-pink/20 text-military-hot-pink flex items-center justify-center text-sm font-bold">6</span>
                    Use of Service
                  </h2>
                  
                  <GlassCard className="p-4 border-green-400/20 mb-4">
                    <h3 className="font-semibold text-white mb-2">Acceptable Use Policy:</h3>
                    <p className="text-military-storm-grey text-sm">
                      You agree to use the Service only for lawful purposes and in accordance with these Terms of Service. You are provided with AI Agents for various business needs, such as Roxy (Executive Assistant) for schedule management, Blaze (Growth & Sales Strategist) for idea validation, Echo (Marketing Maven) for content generation, Lumi (Legal & Docs Agent) for document generation, Vex (Technical Architect) for technical specifications, Lexi (Strategy & Insight Analyst) for data analysis, Nova (Product Designer) for UI/UX brainstorming, and Glitch (QA & Debug Agent) for identifying UX friction.
                    </p>
                  </GlassCard>

                  <GlassCard className="p-4 border-red-400/20 mb-4 border-l-4 border-red-400">
                    <h3 className="font-semibold text-white mb-2">Prohibited Actions:</h3>
                    <p className="text-military-storm-grey text-sm mb-2">You agree not to:</p>
                    <ul className="text-military-storm-grey text-sm list-disc list-inside space-y-1">
                      <li>Use the Service in any way that violates any applicable federal, state, local, or international law or regulation.</li>
                      <li>Engage in any conduct that restricts or inhibits anyone&apos;s use or enjoyment of the Service, or which, as determined by us, may harm SoloSuccess AI or users of the Service or expose them to liability.</li>
                      <li>Introduce any viruses, Trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful.</li>
                      <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service, the server on which the Service is stored, or any server, computer, or database connected to the Service.</li>
                    </ul>
                  </GlassCard>

                  <GlassCard className="p-4 border-yellow-400/20 border-l-4 border-yellow-400">
                    <h3 className="font-semibold text-white mb-2">AI Agent Outputs Disclaimer:</h3>
                    <p className="text-military-storm-grey text-sm">
                      While AI Agents like Lumi (Legal & Docs Agent) can assist with legal requirements and document generation, their outputs come "with appropriate disclaimers&quot;. The information provided by SoloSuccess AI agents is for informational purposes only and does not constitute professional advice (e.g., legal, financial, or technical). You should consult with a qualified professional for advice tailored to your specific situation.
                    </p>
                  </GlassCard>
                </div>

                <SergeantDivider className="my-8" />

                {/* Section 7 */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-military-hot-pink/20 text-military-hot-pink flex items-center justify-center text-sm font-bold">7</span>
                    Disclaimers and Limitation of Liability
                  </h2>
                  
                  <GlassCard className="p-4 border-military-storm-grey/20 mb-4">
                    <h3 className="font-semibold text-white mb-2">"As Is&quot; Basis:</h3>
                    <p className="text-military-storm-grey text-sm">
                      Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE&quot; basis, without any warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement. SoloSuccess AI aims for a scalable, resilient, and maintainable architecture, robust data security, and reliable integrations.
                    </p>
                  </GlassCard>

                  <GlassCard className="p-4 border-blue-400/20 mb-4">
                    <h3 className="font-semibold text-white mb-2">AI Outputs:</h3>
                    <p className="text-military-storm-grey text-sm">
                      SoloSuccess AI does not guarantee the accuracy, completeness, or usefulness of any information generated by the AI Agents or other AI-powered features. The effectiveness of any Large Language Model (LLM) is fundamentally constrained by the quality and structure of the context it is given.
                    </p>
                  </GlassCard>

                  <GlassCard className="p-4 border-red-400/20 border-l-4 border-red-400">
                    <h3 className="font-semibold text-white mb-2">Limitation of Liability:</h3>
                    <p className="text-military-storm-grey text-sm">
                      In no event will SoloSuccess AI, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the Service, including any direct, indirect, special, incidental, consequential, or punitive damages, including but not limited to, personal injury, pain and suffering, emotional distress, loss of revenue, loss of profits, loss of business or anticipated savings, loss of use, loss of goodwill, loss of data, whether caused by tort (including negligence), breach of contract, or otherwise, even if foreseeable.
                    </p>
                  </GlassCard>
                </div>

                <SergeantDivider className="my-8" />

                {/* Sections 8-11 */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-military-hot-pink/20 text-military-hot-pink flex items-center justify-center text-sm font-bold">8</span>
                      Termination
                    </h2>
                    <GlassCard className="p-4 border-military-storm-grey/20 mb-4">
                      <h3 className="font-semibold text-white mb-2">By SoloSuccess AI:</h3>
                      <p className="text-military-storm-grey text-sm">
                        We may terminate or suspend your access to all or part of the Service immediately, without prior notice or liability, if you breach these Terms of Service. This includes processing events related to subscription deletion, which may revert your account to the free tier.
                      </p>
                    </GlassCard>
                    <GlassCard className="p-4 border-military-storm-grey/20">
                      <h3 className="font-semibold text-white mb-2">By You:</h3>
                      <p className="text-military-storm-grey text-sm">
                        You may stop using the Service at any time. Instructions for managing or canceling your subscription can be found within the billing portal.
                      </p>
                    </GlassCard>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-military-hot-pink/20 text-military-hot-pink flex items-center justify-center text-sm font-bold">9</span>
                      Governing Law
                    </h2>
                    <p className="text-military-storm-grey leading-relaxed">
                      These Terms of Service and any dispute or claim arising out of, or related to them, shall be governed by and construed in accordance with the laws of Dougherty County in Albany, Georgia without giving effect to any choice or conflict of law provision or rule.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-military-hot-pink/20 text-military-hot-pink flex items-center justify-center text-sm font-bold">10</span>
                      Changes to Terms of Service
                    </h2>
                    <p className="text-military-storm-grey leading-relaxed">
                      We may revise and update these Terms of Service from time to time in our sole discretion. All changes are effective immediately when we post them and apply to all access to and use of the Service thereafter. Your continued use of the Service following the posting of revised Terms of Service means that you accept and agree to the changes.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-military-hot-pink/20 text-military-hot-pink flex items-center justify-center text-sm font-bold">11</span>
                      Contact Information
                    </h2>
                    <GlassCard className="p-6 border-military-hot-pink/30">
                      <p className="text-military-storm-grey leading-relaxed mb-4">
                        To ask questions or comment about these Terms of Service, you may contact the boss at:
                      </p>
                      <GlassCard className="p-4 border-military-hot-pink/20">
                        <p className="text-military-hot-pink font-semibold">psychedelic.creator@enchantednightmare.com</p>
                      </GlassCard>
                    </GlassCard>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <GlassCard className="max-w-4xl mx-auto p-12 text-center border-military-hot-pink/30">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Build Your Empire?
              </h2>
              <p className="text-xl text-military-storm-grey mb-8">
                Now that you know the terms, it&apos;s time to start your boss journey. Join thousands of entrepreneurs already scaling with SoloSuccess AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <TacticalLink href="/signup" variant="primary" size="lg">
                  Start Building Empire
                  <ArrowRight className="ml-2 w-4 h-4" />
                </TacticalLink>
                <TacticalLink href="/privacy" variant="outline" size="lg">
                  View Privacy Policy
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