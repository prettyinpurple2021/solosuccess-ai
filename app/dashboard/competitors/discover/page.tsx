"use client"


export const dynamic = 'force-dynamic'
import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { useState} from "react"
import { motion} from "framer-motion"
import { useRouter} from "next/navigation"
import { 
  ArrowLeft, Search, Plus, Eye, Zap, Globe, Building, Users, DollarSign, TrendingUp, CheckCircle, AlertTriangle, Lightbulb, Target, Sparkles} from "lucide-react"
import Link from "next/link"

import { BossCard, EmpowermentCard} from "@/components/ui/boss-card"
import { BossButton, ZapButton} from "@/components/ui/boss-button"
import { Input} from "@/components/ui/input"
import { Textarea} from "@/components/ui/textarea"
import { Label} from "@/components/ui/label"
import { Badge} from "@/components/ui/badge"
import { Loading} from "@/components/ui/loading"


interface CompetitorSuggestion {
  id: string
  name: string
  domain: string
  description: string
  industry: string
  headquarters: string
  employeeCount: number
  fundingStage: string
  threatLevel: 'low' | 'medium' | 'high' | 'critical'
  matchScore: number
  matchReasons: string[]
  keyProducts: string[]
  recentNews: string[]
  socialMediaFollowers: {
    linkedin?: number
    twitter?: number
  }
  isAlreadyTracked: boolean
}

export default function CompetitorDiscoveryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [businessDescription, setBusinessDescription] = useState("")
  const [targetMarket, setTargetMarket] = useState("")
  const [keyProducts, setKeyProducts] = useState("")
  const [suggestions, setSuggestions] = useState<CompetitorSuggestion[]>([])
  const [selectedCompetitors, setSelectedCompetitors] = useState<Set<string>>(new Set())

  const handleSearch = async () => {
    if (!businessDescription.trim()) return

    try {
      setSearching(true)
      
      // Call real AI-powered competitor discovery API
      const response = await fetch('/api/competitors/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessDescription,
          targetMarket,
          keyProducts
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to discover competitors')
      }
      
      const data = await response.json()
      const suggestions: CompetitorSuggestion[] = data.suggestions || []
      
      setSuggestions(suggestions)
    } catch (error) {
      logError('Error discovering competitors:', error)
    } finally {
      setSearching(false)
    }
  }

  const toggleCompetitorSelection = (competitorId: string) => {
    const newSelection = new Set(selectedCompetitors)
    if (newSelection.has(competitorId)) {
      newSelection.delete(competitorId)
    } else {
      newSelection.add(competitorId)
    }
    setSelectedCompetitors(newSelection)
  }

  const handleAddSelected = async () => {
    if (selectedCompetitors.size === 0) return

    try {
      setLoading(true)
      
      // Save selected competitors via API
      const selectedCompetitorsData = suggestions.filter(s => selectedCompetitors.has(s.id))
      
      const response = await fetch('/api/competitors/save-discovered', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitors: selectedCompetitorsData
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to save competitors')
      }
      
      router.push('/dashboard/competitors')
    } catch (error) {
      logError('Error adding competitors:', error)
    } finally {
      setLoading(false)
    }
  }

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getThreatLevelBadge = (level: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    }
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-red-600'
    if (score >= 80) return 'text-orange-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="min-h-screen gradient-background p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/competitors">
              <BossButton variant="secondary" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </BossButton>
            </Link>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="w-12 h-12 gradient-success rounded-full flex items-center justify-center"
                >
                  <Search className="w-6 h-6 text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold text-gradient">Discover Competitors</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Use AI to find and analyze potential competitors based on your business
              </p>
            </div>
          </div>
          {selectedCompetitors.size > 0 && (
            <ZapButton
              onClick={handleAddSelected}
              loading={loading}
            >
              Add {selectedCompetitors.size} Competitor{selectedCompetitors.size > 1 ? 's' : ''}
            </ZapButton>
          )}
        </div>

        {/* Search Form */}
        <EmpowermentCard>
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gradient mb-2">Describe Your Business</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Tell us about your business and we'll find similar companies that could be competitors
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="businessDescription">Business Description *</Label>
                <Textarea
                  id="businessDescription"
                  placeholder="Describe what your business does, your main products/services, and your value proposition..."
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetMarket">Target Market</Label>
                  <Input
                    id="targetMarket"
                    placeholder="e.g., Solo entrepreneurs, Small businesses, Enterprise"
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="keyProducts">Key Products/Features</Label>
                  <Input
                    id="keyProducts"
                    placeholder="e.g., Task management, AI automation, Analytics"
                    value={keyProducts}
                    onChange={(e) => setKeyProducts(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="text-center">
              <ZapButton
                onClick={handleSearch}
                loading={searching}
                disabled={!businessDescription.trim()}
              >
                {searching ? 'Discovering Competitors...' : 'Discover Competitors'}
              </ZapButton>
            </div>
          </div>
        </EmpowermentCard>

        {/* Loading State */}
        {searching && (
          <EmpowermentCard>
            <div className="text-center py-12">
              <Loading 
                variant="boss" 
                size="lg" 
                text="AI is analyzing your business and finding competitors..."
              />
              <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>🔍 Scanning business databases...</p>
                <p>🤖 Analyzing market positioning...</p>
                <p>📊 Calculating match scores...</p>
                <p>⚡ Generating insights...</p>
              </div>
            </div>
          </EmpowermentCard>
        )}

        {/* Results */}
        {suggestions.length > 0 && !searching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <EmpowermentCard>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gradient">Competitor Suggestions</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Found {suggestions.length} potential competitors based on your business description
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Lightbulb className="w-4 h-4" />
                  <span>Select competitors to add to your monitoring list</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {suggestions.map((suggestion) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BossCard 
                      variant="default" 
                      interactive={!suggestion.isAlreadyTracked}
                      className={`h-full ${
                        selectedCompetitors.has(suggestion.id) 
                          ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                          : ''
                      } ${suggestion.isAlreadyTracked ? 'opacity-60' : ''}`}
                      onClick={() => !suggestion.isAlreadyTracked && toggleCompetitorSelection(suggestion.id)}
                    >
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className={`w-3 h-3 rounded-full ${getThreatLevelColor(suggestion.threatLevel)}`} />
                              <h4 className="font-bold text-lg text-gradient">{suggestion.name}</h4>
                              {suggestion.isAlreadyTracked && (
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Already Tracked
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {suggestion.domain}
                            </p>
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge 
                                variant="outline" 
                                className={getThreatLevelBadge(suggestion.threatLevel)}
                              >
                                {suggestion.threatLevel.toUpperCase()} THREAT
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`${getMatchScoreColor(suggestion.matchScore)} border-current`}
                              >
                                {suggestion.matchScore}% Match
                              </Badge>
                            </div>
                          </div>
                          
                          {!suggestion.isAlreadyTracked && (
                            <div className="flex items-center space-x-2">
                              {selectedCompetitors.has(suggestion.id) ? (
                                <CheckCircle className="w-6 h-6 text-purple-500" />
                              ) : (
                                <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {suggestion.description}
                        </p>

                        {/* Company Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-500">HQ:</span>
                            <span className="font-medium">{suggestion.headquarters}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-500">Team:</span>
                            <span className="font-medium">{suggestion.employeeCount}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-500">Stage:</span>
                            <span className="font-medium">{suggestion.fundingStage}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-500">Industry:</span>
                            <span className="font-medium">{suggestion.industry}</span>
                          </div>
                        </div>

                        {/* Match Reasons */}
                        <div>
                          <h5 className="font-medium mb-2 text-sm">Why this is a match:</h5>
                          <ul className="space-y-1">
                            {suggestion.matchReasons.slice(0, 3).map((reason, index) => (
                              <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                                <Target className="w-3 h-3 mt-0.5 mr-1 flex-shrink-0 text-purple-500" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Key Products */}
                        <div>
                          <h5 className="font-medium mb-2 text-sm">Key Products:</h5>
                          <div className="flex flex-wrap gap-1">
                            {suggestion.keyProducts.slice(0, 3).map((product, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {product}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Social Media */}
                        {(suggestion.socialMediaFollowers.linkedin || suggestion.socialMediaFollowers.twitter) && (
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {suggestion.socialMediaFollowers.linkedin && (
                              <span>LinkedIn: {suggestion.socialMediaFollowers.linkedin.toLocaleString()}</span>
                            )}
                            {suggestion.socialMediaFollowers.twitter && (
                              <span>Twitter: {suggestion.socialMediaFollowers.twitter.toLocaleString()}</span>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                          <a 
                            href={`https://${suggestion.domain}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Globe className="w-3 h-3 mr-1" />
                            Visit Website
                          </a>
                          
                          {!suggestion.isAlreadyTracked && (
                            <BossButton 
                              variant="primary" 
                              size="sm"
                              onClick={() => {
                                toggleCompetitorSelection(suggestion.id)
                              }}
                            >
                              {selectedCompetitors.has(suggestion.id) ? 'Selected' : 'Select'}
                            </BossButton>
                          )}
                        </div>
                      </div>
                    </BossCard>
                  </motion.div>
                ))}
              </div>
            </EmpowermentCard>

            {/* Help Text */}
            <BossCard variant="default" className="text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <AlertTriangle className="w-4 h-4" />
                <span>
                  Competitor suggestions are generated using AI and public data. Verify information before making strategic decisions.
                </span>
              </div>
            </BossCard>
          </motion.div>
        )}

        {/* Empty State */}
        {suggestions.length === 0 && !searching && businessDescription && (
          <EmpowermentCard>
            <div className="text-center py-12">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="mx-auto w-20 h-20 gradient-warning rounded-full flex items-center justify-center mb-6"
              >
                <Search className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gradient mb-4">No Competitors Found</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We couldn't find any competitors matching your business description. Try refining your description or adding more details about your target market.
              </p>
              <BossButton 
                variant="primary"
                onClick={() => {
                  setBusinessDescription("")
                  setTargetMarket("")
                  setKeyProducts("")
                }}
              >
                Try Different Description
              </BossButton>
            </div>
          </EmpowermentCard>
        )}
      </motion.div>
    </div>
  )
}