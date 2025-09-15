"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Button} from "@/components/ui/button"
import { Badge} from "@/components/ui/badge"
import { Input} from "@/components/ui/input"
import { Label} from "@/components/ui/label"
import { Textarea} from "@/components/ui/textarea"
import { 
  Search, TrendingUp, AlertTriangle, Target, Users, Globe, BarChart3, Lightbulb} from "lucide-react"

// Force dynamic rendering to avoid prerender errors
export const dynamic = 'force-dynamic'

export default function IntelligencePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [_isLoading, setIsLoading] = useState(false)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Competitive Intelligence</h1>
          <p className="text-gray-600">Stay ahead of the competition with real-time insights and analysis</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">
          <BarChart3 className="w-3 h-3 mr-1" />
          Live Intelligence
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Market Intelligence Search
          </CardTitle>
          <CardDescription>
            Search for competitors, market trends, and strategic insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Competitors & Markets</Label>
              <Input
                id="search"
                placeholder="Enter competitor name, industry, or market..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => setIsLoading(true)} 
                disabled={!searchTerm.trim()}
                className="px-6"
              >
                <Search className="w-4 h-4 mr-2" />
                Analyze
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Intelligence Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Market Position */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Market Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Your Position</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Market Leader
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Competition Level</span>
                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                  High
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Competitors */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Key Competitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Competitor A</span>
                <Badge variant="secondary">High Threat</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Competitor B</span>
                <Badge variant="outline">Medium Threat</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Competitor C</span>
                <Badge variant="outline">Low Threat</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Trends */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Market Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>AI Integration Growing</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Mobile-First Approach</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Privacy Focus</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Strategic Insights
          </CardTitle>
          <CardDescription>
            AI-powered analysis and recommendations for your competitive strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Opportunities</h4>
              <div className="space-y-2">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Market Gap:</strong> Underserved segment in mobile-first solutions
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Technology:</strong> AI integration can differentiate your offering
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Threats</h4>
              <div className="space-y-2">
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Competition:</strong> Competitor A launching similar features
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Market:</strong> Economic uncertainty affecting customer spending
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Recommended Actions
          </CardTitle>
          <CardDescription>
            Priority actions based on competitive intelligence analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-900">High Priority</h4>
                <p className="text-sm text-orange-800">
                  Accelerate AI feature development to maintain competitive advantage
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <Target className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">Medium Priority</h4>
                <p className="text-sm text-blue-800">
                  Strengthen mobile experience to capture growing mobile-first market
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <Globe className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900">Low Priority</h4>
                <p className="text-sm text-green-800">
                  Monitor competitor pricing strategies for potential adjustments
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
