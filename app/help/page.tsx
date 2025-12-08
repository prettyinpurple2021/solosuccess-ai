'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { CyberPageLayout } from '@/components/cyber/CyberPageLayout'
import { HudBorder } from '@/components/cyber/HudBorder'
import { Input } from '@/components/ui/input'
import { HelpCircle, Search, MessageCircle, Mail, ChevronDown, ChevronRight } from 'lucide-react'

const faqItems = [
  {
    question: 'How do I get started?',
    answer: 'Sign up for a free account and follow the onboarding process to set up your AI agents.',
  },
  {
    question: 'What AI agents are available?',
    answer: 'We offer 8 specialized AI agents including Executive Assistant, Growth Strategist, Marketing Maven, and more.',
  },
  {
    question: 'How secure is my data?',
    answer: 'All data is encrypted using quantum-grade encryption protocols and stored on secure infrastructure.',
  },
  {
    question: 'Can I customize my AI agents?',
    answer: 'Yes, you can customize agent behavior, responses, and workflows to match your business needs.',
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpen = new Set(openItems)
    if (newOpen.has(index)) {
      newOpen.delete(index)
    } else {
      newOpen.add(index)
    }
    setOpenItems(newOpen)
  }

  return (
    <CyberPageLayout>
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyber-cyan/30 bg-cyber-cyan/5 rounded-none mb-6">
              <HelpCircle className="w-4 h-4 text-cyber-cyan" />
              <span className="text-xs font-bold tracking-widest text-cyber-cyan uppercase">Support Center</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-sci font-bold text-white mb-6">
              HELP <span className="text-cyber-cyan">CENTER</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto font-tech">
              Find answers to common questions and get support.
            </p>
          </div>

          <HudBorder className="p-8 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="pl-10 bg-cyber-dark/50 border-cyber-cyan/30 text-white placeholder:text-gray-500 focus:border-cyber-cyan"
              />
            </div>
          </HudBorder>

          <div className="space-y-4 mb-8">
            {faqItems.map((item, index) => (
              <HudBorder key={index} variant="hover" className="p-6 cursor-pointer" onClick={() => toggleItem(index)}>
                <div className="flex items-center justify-between">
                  <h3 className="font-sci text-lg text-white">{item.question}</h3>
                  {openItems.has(index) ? (
                    <ChevronDown className="w-5 h-5 text-cyber-cyan" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                {openItems.has(index) && (
                  <p className="mt-4 text-gray-400 font-tech leading-relaxed">{item.answer}</p>
                )}
              </HudBorder>
            ))}
          </div>

          <HudBorder className="p-8">
            <h3 className="font-sci text-xl text-white mb-4">CONTACT_SUPPORT</h3>
            <p className="text-gray-400 font-tech mb-6">
              Need more help? Contact our support team for assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:support@solosuccessai.fun"
                className="flex items-center gap-2 text-cyber-cyan hover:text-cyber-purple font-tech"
              >
                <Mail className="w-5 h-5" />
                support@solosuccessai.fun
              </a>
              <a
                href="/contact"
                className="flex items-center gap-2 text-cyber-cyan hover:text-cyber-purple font-tech"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Form
              </a>
            </div>
          </HudBorder>
        </div>
      </div>
    </CyberPageLayout>
  )
}
