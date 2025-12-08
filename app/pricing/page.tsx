'use client'

import Link from 'next/link'
import { CyberPageLayout } from '@/components/cyber/CyberPageLayout'
import { HudBorder } from '@/components/cyber/HudBorder'
import { CyberButton } from '@/components/cyber/CyberButton'
import { Check } from 'lucide-react'

const pricingPlans = [
  {
    id: 'launch',
    title: 'CORE_ACCESS',
    price: 'FREE',
    subtitle: 'No Validation Required',
    features: [
      'Basic Agent Access',
      'Neural Hub Lite',
      'Network Support',
    ],
    cta: 'Start Sequence',
    popular: false,
  },
  {
    id: 'accelerator',
    title: 'ARCHITECT_PRO',
    price: 'SCALE',
    subtitle: 'Full System Suite',
    features: [
      '8 Specialized Agents',
      'Unlimited Processes',
      'Priority Data Streams',
      'Quantum Encryption+',
    ],
    cta: 'Full Upgrade',
    popular: true,
  },
]

export default function PricingPage() {
  return (
    <CyberPageLayout>
      <div className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-sci font-bold text-white">INITIALIZE SEQUENCE</h1>
            <p className="text-cyber-cyan mt-4 font-tech tracking-widest uppercase">
              Join the network of autonomous founders.
            </p>
            <div className="w-24 h-1 bg-cyber-purple mx-auto mt-4 shadow-[0_0_15px_#bd00ff]"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {pricingPlans.map((plan) => (
              <HudBorder
                key={plan.id}
                className={`p-8 flex flex-col items-center text-center relative overflow-hidden ${
                  plan.popular ? 'border-cyber-purple/50' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-cyber-purple text-white text-[10px] font-bold px-3 py-1 font-sci">
                    RECOMMENDED
                  </div>
                )}
                
                <h3 className={`font-sci text-xl ${plan.popular ? 'text-cyber-purple' : 'text-gray-400'}`}>
                  {plan.title}
                </h3>
                <div className="text-4xl font-sci font-bold text-white mt-4 mb-2">{plan.price}</div>
                <span className={`text-xs font-tech uppercase tracking-widest mb-8 ${
                  plan.popular ? 'text-cyber-purple' : 'text-cyber-cyan'
                }`}>
                  {plan.subtitle}
                </span>
                
                <ul className="space-y-3 mb-8 text-sm font-tech text-gray-400 w-full text-left pl-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <span className={`mr-2 ${plan.popular ? 'text-cyber-purple' : 'text-cyber-cyan'}`}>
                        {'>>'}
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/signup" className="w-full">
                  <CyberButton
                    variant={plan.popular ? 'ghost' : 'secondary'}
                    size="md"
                    className={`w-full ${
                      plan.popular
                        ? 'bg-cyber-purple/20 border-cyber-purple hover:bg-cyber-purple hover:text-white text-cyber-purple shadow-[0_0_15px_rgba(189,0,255,0.2)]'
                        : ''
                    }`}
                  >
                    {plan.cta}
                  </CyberButton>
                </Link>
              </HudBorder>
            ))}
          </div>
        </div>
      </div>
    </CyberPageLayout>
  )
}
