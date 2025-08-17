"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface BrandData {
  name: string
  tagline: string
  description: string
  industry: string
  primaryColor: string
  secondaryColor: string
  logoStyle: string
}

export default function BrandPage() {
  const [brandData, setBrandData] = useState<BrandData>({
    name: "",
    tagline: "",
    description: "",
    industry: "",
    primaryColor: "#8B5CF6",
    secondaryColor: "#EC4899",
    logoStyle: "modern"
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleInputChange = (field: keyof BrandData, value: string) => {
    setBrandData(prev => ({ ...prev, [field]: value }))
  }

  // This handleSave function has the PROBLEMATIC payload structure described in the issue
  const handleSave = async () => {
    if (!brandData.name.trim()) {
      setSaveError("Please enter a brand name before saving")
      setTimeout(() => setSaveError(null), 3000)
      return
    }

    setIsSaving(true)
    setSaveError(null)
    setSaveMessage(null)

    try {
      // PROBLEM: This payload structure doesn't match the API schema
      // - Sends 'name' instead of 'brandName' 
      // - Sends separate 'primaryColor'/'secondaryColor' instead of 'colors' object
      const payload = {
        name: brandData.name,  // ❌ Should be 'brandName'
        tagline: brandData.tagline,
        description: brandData.description,
        industry: brandData.industry,
        primaryColor: brandData.primaryColor,  // ❌ Should be part of 'colors' object
        secondaryColor: brandData.secondaryColor,  // ❌ Should be part of 'colors' object
        logoStyle: brandData.logoStyle
      }

      const response = await fetch('/api/brand/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        setSaveMessage('Brand saved successfully')
        setTimeout(() => setSaveMessage(null), 5000)
      } else {
        const errorData = await response.json()
        setSaveError(errorData.error || 'Failed to save brand')
        setTimeout(() => setSaveError(null), 5000)
      }
    } catch (error) {
      console.error('Error saving brand:', error)
      setSaveError('Failed to save brand')
      setTimeout(() => setSaveError(null), 5000)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Brand Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Define your brand identity and visual elements
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Brand Details</CardTitle>
            <CardDescription>
              Configure your brand settings and identity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Brand Name *</Label>
                <Input
                  id="name"
                  value={brandData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your brand name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={brandData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={brandData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                placeholder="Enter your brand tagline"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={brandData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your brand"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="primaryColor"
                    value={brandData.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="w-12 h-10 rounded border border-input cursor-pointer"
                  />
                  <Input
                    value={brandData.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    placeholder="#8B5CF6"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="secondaryColor"
                    value={brandData.secondaryColor}
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    className="w-12 h-10 rounded border border-input cursor-pointer"
                  />
                  <Input
                    value={brandData.secondaryColor}
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    placeholder="#EC4899"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoStyle">Logo Style</Label>
              <Select value={brandData.logoStyle} onValueChange={(value) => handleInputChange('logoStyle', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select logo style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="elegant">Elegant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-4">
              {saveMessage && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>{saveMessage}</span>
                </div>
              )}
              
              {saveError && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{saveError}</span>
                </div>
              )}

              <Button onClick={handleSave} disabled={isSaving} className="w-fit">
                {isSaving ? (
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
