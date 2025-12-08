'use client'

export const dynamic = 'force-dynamic'

import { CyberPageLayout } from '@/components/cyber/CyberPageLayout'
import { HudBorder } from '@/components/cyber/HudBorder'
import { Users, Calendar, Network, Rocket, MessageCircle, Bell } from 'lucide-react'

export default function CommunityPage() {
  return (
    <CyberPageLayout>
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyber-purple/30 bg-cyber-purple/5 rounded-none mb-6">
              <Users className="w-4 h-4 text-cyber-purple" />
              <span className="text-xs font-bold tracking-widest text-cyber-purple uppercase">Network Hub</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-sci font-bold text-white mb-6">
              BOSS <span className="text-cyber-purple">COMMUNITY</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto font-tech">
              Connect with fellow entrepreneurs and build your network.
            </p>
          </div>

          <HudBorder className="p-8 mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-cyber-cyan" />
              <span className="font-sci text-lg text-white">Official Launch Date</span>
            </div>
            <div className="font-sci text-3xl font-bold text-cyber-purple mb-4">July 1, 2026</div>
            <p className="text-gray-400 font-tech">
              The ultimate social platform for entrepreneurs, startups, and small businesses.
            </p>
          </HudBorder>

          <div className="grid md:grid-cols-3 gap-6">
            <HudBorder variant="hover" className="p-6">
              <Network className="w-8 h-8 text-cyber-cyan mb-4" />
              <h3 className="font-sci text-lg text-white mb-2">Network Building</h3>
              <p className="text-sm text-gray-400 font-tech">
                Connect with like-minded entrepreneurs and build valuable relationships.
              </p>
            </HudBorder>

            <HudBorder variant="hover" className="p-6">
              <MessageCircle className="w-8 h-8 text-cyber-purple mb-4" />
              <h3 className="font-sci text-lg text-white mb-2">Collaboration</h3>
              <p className="text-sm text-gray-400 font-tech">
                Share ideas, get feedback, and collaborate on projects.
              </p>
            </HudBorder>

            <HudBorder variant="hover" className="p-6">
              <Rocket className="w-8 h-8 text-cyber-cyan mb-4" />
              <h3 className="font-sci text-lg text-white mb-2">Growth Resources</h3>
              <p className="text-sm text-gray-400 font-tech">
                Access exclusive resources, tools, and insights to accelerate your growth.
              </p>
            </HudBorder>
          </div>
        </div>
      </div>
    </CyberPageLayout>
  )
}
