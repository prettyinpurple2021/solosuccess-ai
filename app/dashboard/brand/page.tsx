// @ts-nocheck
'use client'

import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import {
  Palette, 
  Type, 
  ImageIcon, 
  Download, 
  Save, 
  Sparkles, 
  Crown, 
  Lightbulb,
  Loader2,
  CheckCircle,
  AlertCircle,
  Upload,
  Eye,
  Edit
} from 'lucide-react'

interface BrandSettings {
  id?: string
  companyName: string
  tagline: string
  description: string
  industry: string
  targetAudience: string
  brandPersonality: string[]
  colorPalette: {
    name?: string
    primary: string
    secondary: string
    accent: string
    neutral: string
    success: string
    warning: string
    error: string
  }
  typography: {
    primary: string
    secondary: string
  }
  logoUrl?: string
  logoPrompt?: string
  moodboard: string[]
  createdAt?: string
  updatedAt?: string
}

const INDUSTRY_OPTIONS = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
  'Consulting', 'Marketing', 'Real Estate', 'Food & Beverage', 'Fashion',
  'Entertainment', 'Travel', 'Non-profit', 'Other'
]

const PERSONALITY_TRAITS = [
  'Professional', 'Creative', 'Innovative', 'Trustworthy', 'Friendly', 'Luxury',
  'Modern', 'Traditional', 'Bold', 'Minimalist', 'Playful', 'Serious',
  'Approachable', 'Authoritative', 'Energetic', 'Calm'
]

const COLOR_PALETTES = [
  {
    name: "Boss Babe Purple",
    primary: "#8E24AA",
    secondary: "#E1BEE7",
    accent: "#FF4081",
    neutral: "#F5F5F5",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336"
  },
  {
    name: "Empire Gold",
    primary: "#FFD700",
    secondary: "#FFF8DC",
    accent: "#FF6B35",
    neutral: "#F8F8F8",
    success: "#2E7D32",
    warning: "#F57C00",
    error: "#D32F2F"
  },
  {
    name: "Success Blue",
    primary: "#1976D2",
    secondary: "#BBDEFB",
    accent: "#00BCD4",
    neutral: "#FAFAFA",
    success: "#388E3C",
    warning: "#F9A825",
    error: "#E53935"
  },
  {
    name: "Power Green",
    primary: "#4CAF50",
    secondary: "#C8E6C9",
    accent: "#FFC107",
    neutral: "#F1F8E9",
    success: "#2E7D32",
    warning: "#FF9800",
    error: "#D32F2F"
  }
]

export default function BrandStudioPage() {
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({
    companyName: '',
    tagline: '',
    description: '',
    industry: '',
    targetAudience: '',
    brandPersonality: [],
    colorPalette: COLOR_PALETTES[0],
    typography: {
      primary: 'Inter',
      secondary: 'Roboto'
    },
    moodboard: []
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generatingLogo, setGeneratingLogo] = useState(false)
  const [logoGenerated, setLogoGenerated] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadBrandSettings()
  }, [])

  const loadBrandSettings = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/brand/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.brand) {
          setBrandSettings(data.brand)
        }
      }
    } catch (error) {
      logError('Error loading brand settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveBrandSettings = async () => {
    try {
      setSaving(true)
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/brand/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(brandSettings)
      })

      if (response.ok) {
        // Show success message
        logInfo('Brand settings saved successfully')
      }
    } catch (error) {
      logError('Error saving brand settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const generateLogo = async () => {
    if (!brandSettings.companyName || !brandSettings.industry) {
      alert('Please fill in company name and industry before generating a logo')
      return
    }

    try {
      setGeneratingLogo(true)
      const token = localStorage.getItem('auth_token')
      
      const prompt = `Create a professional logo for ${brandSettings.companyName}, a ${brandSettings.industry} company. 
      Brand personality: ${brandSettings.brandPersonality.join(', ')}. 
      Colors: Primary ${brandSettings.colorPalette.primary}, Secondary ${brandSettings.colorPalette.secondary}. 
      Style: Modern, clean, professional.`

      const response = await fetch('/api/brand/generate-logo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          prompt,
          companyName: brandSettings.companyName,
          industry: brandSettings.industry,
          colorPalette: brandSettings.colorPalette
        })
      })

      if (response.ok) {
        const data = await response.json()
        setBrandSettings(prev => ({
          ...prev,
          logoUrl: data.logoUrl,
          logoPrompt: prompt
        }))
        setLogoGenerated(true)
      }
    } catch (error) {
      logError('Error generating logo:', error)
    } finally {
      setGeneratingLogo(false)
    }
  }

  const updateBrandSettings = (updates: Partial<BrandSettings>) => {
    setBrandSettings(prev => ({ ...prev, ...updates }))
  }

  const togglePersonalityTrait = (trait: string) => {
    setBrandSettings(prev => ({
      ...prev,
      brandPersonality: prev.brandPersonality.includes(trait)
        ? prev.brandPersonality.filter(t => t !== trait)
        : [...prev.brandPersonality, trait]
    }))
  }

  const selectColorPalette = (palette: typeof COLOR_PALETTES[0]) => {
    setBrandSettings(prev => ({
      ...prev,
      colorPalette: palette
    }))
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brand Studio</h1>
          <p className="text-gray-600">Create and manage your brand identity</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={saveBrandSettings} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Brand
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="visuals">Visuals</TabsTrigger>
          <TabsTrigger value="logo">Logo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Brand Overview
                </CardTitle>
                <CardDescription>
                  Define your brand's core identity and values
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={brandSettings.companyName}
                    onChange={(e) => updateBrandSettings({ companyName: e.target.value })}
                    placeholder="Enter your company name"
                  />
                </div>
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={brandSettings.tagline}
                    onChange={(e) => updateBrandSettings({ tagline: e.target.value })}
                    placeholder="Your brand's tagline"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Brand Description</Label>
                  <Textarea
                    id="description"
                    value={brandSettings.description}
                    onChange={(e) => updateBrandSettings({ description: e.target.value })}
                    placeholder="Describe your brand, what you do, and what makes you unique"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <select
                    id="industry"
                    value={brandSettings.industry}
                    onChange={(e) => updateBrandSettings({ industry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    aria-label="Select your industry"
                  >
                    <option value="">Select your industry</option>
                    {INDUSTRY_OPTIONS.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Textarea
                    id="targetAudience"
                    value={brandSettings.targetAudience}
                    onChange={(e) => updateBrandSettings({ targetAudience: e.target.value })}
                    placeholder="Describe your ideal customers"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Brand Personality
                </CardTitle>
                <CardDescription>
                  Select traits that describe your brand's personality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {PERSONALITY_TRAITS.map(trait => (
                    <Badge
                      key={trait}
                      variant={brandSettings.brandPersonality.includes(trait) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => togglePersonalityTrait(trait)}
                    >
                      {trait}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="identity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Typography
              </CardTitle>
              <CardDescription>
                Choose fonts that represent your brand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryFont">Primary Font</Label>
                  <select
                    id="primaryFont"
                    value={brandSettings.typography.primary}
                    onChange={(e) => updateBrandSettings({ 
                      typography: { ...brandSettings.typography, primary: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    aria-label="Select primary font"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Poppins">Poppins</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="secondaryFont">Secondary Font</Label>
                  <select
                    id="secondaryFont"
                    value={brandSettings.typography.secondary}
                    onChange={(e) => updateBrandSettings({ 
                      typography: { ...brandSettings.typography, secondary: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    aria-label="Select secondary font"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Poppins">Poppins</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visuals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Color Palette
              </CardTitle>
              <CardDescription>
                Choose a color scheme that reflects your brand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COLOR_PALETTES.map((palette, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      brandSettings.colorPalette.name === palette.name || 
                      (brandSettings.colorPalette.primary === palette.primary && 
                       brandSettings.colorPalette.secondary === palette.secondary)
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => selectColorPalette(palette)}
                  >
                    <h3 className="font-medium mb-3">{palette.name}</h3>
                    <div className="flex gap-2">
                      <div 
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: `var(--bg-color-${Math.random().toString(36).substr(2, 9)})`}}
                        title="Primary"
                      ></div>
                      <div 
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: `var(--bg-color-${Math.random().toString(36).substr(2, 9)})`}}
                        title="Secondary"
                      ></div>
                      <div 
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: `var(--bg-color-${Math.random().toString(36).substr(2, 9)})`}}
                        title="Accent"
                      ></div>
                      <div 
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: `var(--bg-color-${Math.random().toString(36).substr(2, 9)})`}}
                        title="Neutral"
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-medium mb-3">Current Color Palette</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Primary</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: `var(--bg-color-${Math.random().toString(36).substr(2, 9)})`}}
                      ></div>
                      <span className="text-sm font-mono">{brandSettings.colorPalette.primary}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Secondary</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: `var(--bg-color-${Math.random().toString(36).substr(2, 9)})`}}
                      ></div>
                      <span className="text-sm font-mono">{brandSettings.colorPalette.secondary}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Accent</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: `var(--bg-color-${Math.random().toString(36).substr(2, 9)})`}}
                      ></div>
                      <span className="text-sm font-mono">{brandSettings.colorPalette.accent}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Neutral</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: `var(--bg-color-${Math.random().toString(36).substr(2, 9)})`}}
                      ></div>
                      <span className="text-sm font-mono">{brandSettings.colorPalette.neutral}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Logo Generation
              </CardTitle>
              <CardDescription>
                Generate a professional logo for your brand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {brandSettings.logoUrl ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <img 
                      src={brandSettings.logoUrl} 
                      alt="Generated Logo" 
                      className="max-h-32 max-w-full object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button onClick={generateLogo} disabled={generatingLogo}>
                      {generatingLogo ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate New Logo
                        </>
                      )}
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  {logoGenerated && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Logo generated successfully!</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center w-24 h-24 mx-auto bg-gray-100 rounded-lg">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">No logo generated yet</h3>
                    <p className="text-gray-600">
                      Generate a professional logo based on your brand settings
                    </p>
                  </div>
                  <Button onClick={generateLogo} disabled={generatingLogo || !brandSettings.companyName}>
                    {generatingLogo ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Logo...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Logo
                      </>
                    )}
                  </Button>
                  {!brandSettings.companyName && (
                    <div className="flex items-center gap-2 text-amber-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Please fill in your company name first</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}