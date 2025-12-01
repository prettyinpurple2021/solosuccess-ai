"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Settings, Lightbulb, Zap, Target, Users, FileText, MessageCircle, TrendingUp } from "lucide-react"
import { logger, logInfo } from "@/lib/logger"

interface TipSettingsProps {
  open: boolean
  onClose: () => void
}

export function TipSettings({ open, onClose }: TipSettingsProps) {
  const [preferences, setPreferences] = useState({
    tipsEnabled: true,
    tipFrequency: "medium" as "low" | "medium" | "high",
    categories: {
      productivity: true,
      ai: true,
      goals: true,
      tasks: true,
      navigation: true,
      features: true
    }
  })

  // Load preferences on mount
  useEffect(() => {
    const saved = localStorage.getItem('smart-tip-preferences')
    if (saved) {
      try {
        setPreferences(JSON.parse(saved))
      } catch (error) {
        logInfo('Failed to load tip preferences:', error)
      }
    }
  }, [])

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('smart-tip-preferences', JSON.stringify(preferences))
  }, [preferences])

  const handleToggleCategory = (category: keyof typeof preferences.categories) => {
    setPreferences(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: !prev.categories[category]
      }
    }))
  }

  const handleReset = () => {
    setPreferences({
      tipsEnabled: true,
      tipFrequency: "medium",
      categories: {
        productivity: true,
        ai: true,
        goals: true,
        tasks: true,
        navigation: true,
        features: true
      }
    })
  }

  const categoryInfo = [
    { key: 'productivity', label: 'Productivity Tips', icon: Zap, color: 'from-blue-500 to-indigo-500' },
    { key: 'ai', label: 'AI Assistance', icon: MessageCircle, color: 'from-purple-500 to-pink-500' },
    { key: 'goals', label: 'Goal Setting', icon: Target, color: 'from-green-500 to-teal-500' },
    { key: 'tasks', label: 'Task Management', icon: FileText, color: 'from-orange-500 to-red-500' },
    { key: 'navigation', label: 'Navigation', icon: TrendingUp, color: 'from-gray-500 to-slate-500' },
    { key: 'features', label: 'Features', icon: Lightbulb, color: 'from-pink-500 to-rose-500' }
  ]

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="boss-card border-2 border-purple-200 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="boss-heading text-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Settings className="h-4 w-4 text-white" />
                  </div>
                  Smart Tip Settings
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Main toggle */}
              <div className="flex items-center justify-between p-4 border-2 border-transparent hover:border-purple-200 rounded-xl transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Enable Smart Tips</h3>
                    <p className="text-sm text-muted-foreground">
                      Get contextual advice when you might need help
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.tipsEnabled}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, tipsEnabled: checked }))
                  }
                />
              </div>

              {preferences.tipsEnabled && (
                <>
                  {/* Frequency setting */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Tip Frequency</Label>
                    <Select
                      value={preferences.tipFrequency}
                      onValueChange={(value: "low" | "medium" | "high") =>
                        setPreferences(prev => ({ ...prev, tipFrequency: value }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">Low</Badge>
                            <span>1-2 tips per hour</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700">Medium</Badge>
                            <span>2-3 tips per hour</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs bg-red-100 text-red-700">High</Badge>
                            <span>3-5 tips per hour</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category toggles */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Tip Categories</Label>
                    <div className="grid gap-3">
                      {categoryInfo.map((category) => (
                        <div
                          key={category.key}
                          className="flex items-center justify-between p-3 border-2 border-transparent hover:border-purple-200 rounded-xl transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                              <category.icon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">{category.label}</h4>
                              <p className="text-xs text-muted-foreground">
                                {category.key === 'productivity' && 'Time management and efficiency tips'}
                                {category.key === 'ai' && 'AI usage and optimization advice'}
                                {category.key === 'goals' && 'Goal setting and achievement strategies'}
                                {category.key === 'tasks' && 'Task organization and completion tips'}
                                {category.key === 'navigation' && 'App navigation and feature discovery'}
                                {category.key === 'features' && 'Hidden features and advanced functionality'}
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={preferences.categories[category.key as keyof typeof preferences.categories]}
                            onCheckedChange={() => handleToggleCategory(category.key as keyof typeof preferences.categories)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="text-sm"
                >
                  Reset to Defaults
                </Button>
                <Button
                  onClick={onClose}
                  className="punk-button text-white"
                >
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
