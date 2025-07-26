"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Type, ImageIcon, Download, Sparkles, Eye, CreditCard, FileText, Share2 } from "lucide-react"

export default function BrandStyler() {
  const [brandInfo, setBrandInfo] = useState({
    name: "",
    industry: "",
    description: "",
    personality: "",
    targetAudience: "",
  })

  const [generatedColors, setGeneratedColors] = useState([
    { name: "Primary", hex: "#3B82F6", usage: "Main brand color" },
    { name: "Secondary", hex: "#10B981", usage: "Accent and highlights" },
    { name: "Neutral", hex: "#6B7280", usage: "Text and backgrounds" },
    { name: "Accent", hex: "#F59E0B", usage: "Call-to-action elements" },
  ])

  const [selectedFonts, setSelectedFonts] = useState({
    heading: "Inter",
    body: "Open Sans",
    accent: "Playfair Display",
  })

  const fontOptions = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Playfair Display",
    "Merriweather",
    "Source Sans Pro",
  ]

  const logoStyles = [
    { id: 1, name: "Modern Minimal", preview: "SB", style: "Clean geometric shapes" },
    { id: 2, name: "Classic Serif", preview: "SB", style: "Traditional typography" },
    { id: 3, name: "Tech Forward", preview: "SB", style: "Futuristic elements" },
    { id: 4, name: "Handcrafted", preview: "SB", style: "Organic, hand-drawn feel" },
  ]

  const brandAssets = [
    { name: "Business Card", type: "Print", status: "Ready", icon: CreditCard },
    { name: "Letterhead", type: "Print", status: "Ready", icon: FileText },
    { name: "Social Media Kit", type: "Digital", status: "Generating", icon: Share2 },
    { name: "Logo Variations", type: "Digital", status: "Ready", icon: ImageIcon },
  ]

  const generateColors = () => {
    const colors = [
      { name: "Primary", hex: "#" + Math.floor(Math.random() * 16777215).toString(16), usage: "Main brand color" },
      {
        name: "Secondary",
        hex: "#" + Math.floor(Math.random() * 16777215).toString(16),
        usage: "Accent and highlights",
      },
      { name: "Neutral", hex: "#" + Math.floor(Math.random() * 16777215).toString(16), usage: "Text and backgrounds" },
      {
        name: "Accent",
        hex: "#" + Math.floor(Math.random() * 16777215).toString(16),
        usage: "Call-to-action elements",
      },
    ]
    setGeneratedColors(colors)
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>BrandStyler</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
            <Palette className="h-8 w-8 text-purple-500" />
            BrandStyler
          </h1>
          <p className="text-muted-foreground">Create professional brand assets with AI-powered design tools</p>
        </div>

        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="setup">Brand Setup</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="assets">Brand Assets</TabsTrigger>
          </TabsList>

          {/* Brand Setup Tab */}
          <TabsContent value="setup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Brand Information</CardTitle>
                <CardDescription>Tell us about your brand to generate personalized design elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="brandName">Brand Name</Label>
                    <Input
                      id="brandName"
                      placeholder="Enter your brand name"
                      value={brandInfo.name}
                      onChange={(e) => setBrandInfo({ ...brandInfo, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select
                      value={brandInfo.industry}
                      onValueChange={(value) => setBrandInfo({ ...brandInfo, industry: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="creative">Creative Services</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Brand Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what your brand does and what makes it unique"
                    value={brandInfo.description}
                    onChange={(e) => setBrandInfo({ ...brandInfo, description: e.target.value })}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="personality">Brand Personality</Label>
                    <Input
                      id="personality"
                      placeholder="e.g., Professional, Creative, Friendly"
                      value={brandInfo.personality}
                      onChange={(e) => setBrandInfo({ ...brandInfo, personality: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Input
                      id="audience"
                      placeholder="e.g., Small business owners, Millennials"
                      value={brandInfo.targetAudience}
                      onChange={(e) => setBrandInfo({ ...brandInfo, targetAudience: e.target.value })}
                    />
                  </div>
                </div>

                <Button className="w-full">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Brand Elements
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Brand Color Palette</h3>
                <p className="text-sm text-muted-foreground">AI-generated colors based on your brand</p>
              </div>
              <Button onClick={generateColors}>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate New Palette
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {generatedColors.map((color, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="w-full h-20 rounded-lg mb-3 border" style={{ backgroundColor: color.hex }}></div>
                    <div className="space-y-1">
                      <h4 className="font-medium">{color.name}</h4>
                      <p className="text-sm font-mono text-muted-foreground">{color.hex}</p>
                      <p className="text-xs text-muted-foreground">{color.usage}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Color Usage Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Primary Applications</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Logo and brand marks</li>
                      <li>• Primary call-to-action buttons</li>
                      <li>• Header backgrounds</li>
                      <li>• Key navigation elements</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Secondary Applications</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Accent elements and highlights</li>
                      <li>• Secondary buttons and links</li>
                      <li>• Icons and illustrations</li>
                      <li>• Decorative elements</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Typography System</h3>
              <p className="text-sm text-muted-foreground">Choose fonts that reflect your brand personality</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    Heading Font
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select
                    value={selectedFonts.heading}
                    onValueChange={(value) => setSelectedFonts({ ...selectedFonts, heading: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="p-3 border rounded-lg">
                    <h2 className="text-2xl font-bold" style={{ fontFamily: selectedFonts.heading }}>
                      Your Brand Name
                    </h2>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    Body Font
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select
                    value={selectedFonts.body}
                    onValueChange={(value) => setSelectedFonts({ ...selectedFonts, body: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="p-3 border rounded-lg">
                    <p style={{ fontFamily: selectedFonts.body }}>
                      This is how your body text will look in marketing materials and website content.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    Accent Font
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select
                    value={selectedFonts.accent}
                    onValueChange={(value) => setSelectedFonts({ ...selectedFonts, accent: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="p-3 border rounded-lg">
                    <p className="text-lg italic" style={{ fontFamily: selectedFonts.accent }}>
                      Special Occasions
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Logo Concepts */}
            <Card>
              <CardHeader>
                <CardTitle>Logo Concepts</CardTitle>
                <CardDescription>AI-generated logo ideas based on your brand</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {logoStyles.map((logo) => (
                    <div
                      key={logo.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="w-full h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-3">
                        <span className="text-2xl font-bold text-gray-600">{logo.preview}</span>
                      </div>
                      <h4 className="font-medium">{logo.name}</h4>
                      <p className="text-xs text-muted-foreground">{logo.style}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Brand Assets Tab */}
          <TabsContent value="assets" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Brand Asset Library</h3>
              <p className="text-sm text-muted-foreground">Download ready-to-use brand materials</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {brandAssets.map((asset, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <asset.icon className="h-8 w-8 text-muted-foreground" />
                      <Badge variant={asset.status === "Ready" ? "default" : "secondary"}>{asset.status}</Badge>
                    </div>
                    <h4 className="font-medium">{asset.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{asset.type}</p>
                    <Button className="w-full" size="sm" disabled={asset.status !== "Ready"}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Brand Guidelines</CardTitle>
                <CardDescription>Complete brand style guide for consistent application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-medium">Included Guidelines</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Eye className="h-3 w-3" />
                        Logo usage and variations
                      </li>
                      <li className="flex items-center gap-2">
                        <Palette className="h-3 w-3" />
                        Color palette specifications
                      </li>
                      <li className="flex items-center gap-2">
                        <Type className="h-3 w-3" />
                        Typography hierarchy
                      </li>
                      <li className="flex items-center gap-2">
                        <ImageIcon className="h-3 w-3" />
                        Photography style guide
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">File Formats</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">PDF</Badge>
                      <Badge variant="outline">PNG</Badge>
                      <Badge variant="outline">SVG</Badge>
                      <Badge variant="outline">JPG</Badge>
                      <Badge variant="outline">AI</Badge>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  <Download className="mr-2 h-4 w-4" />
                  Download Complete Brand Guidelines
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
