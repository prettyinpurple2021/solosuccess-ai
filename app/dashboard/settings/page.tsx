"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Loading } from "@/components/ui/loading"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import {
  User,
  Mail,
  Lock,
  Trash2,
  LogOut,
  Save,
  AlertTriangle,
  Crown,
  Heart,
  Sparkles,
  Shield,
  Target,
  Settings,
  Bell,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Globe,
  Database,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import {
  TacticalButton,
  GlassCard,
  RankStars,
  CamoBackground,
  SergeantDivider,
  StatsBadge,
  TacticalGrid,
  TacticalGridItem
} from '@/components/military'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import Link from 'next/link'

export default function SettingsPage() {
  const { user, signOut, loading } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const [formData, setFormData] = useState({
    displayName: (user as any)?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
    weeklyReports: true,
    productUpdates: true
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    dataSharing: false,
    analyticsTracking: true,
    cookieConsent: true
  })

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast({
        title: "Mission Accomplished",
        description: "Your tactical settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Mission Failed",
        description: "Unable to save settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      toast({
        title: "Account Terminated",
        description: "Your tactical account has been permanently deleted.",
      })
      await signOut()
    } catch (error) {
      toast({
        title: "Mission Failed",
        description: "Unable to delete account. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-military-midnight flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-military-hot-pink border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-military-midnight relative overflow-hidden">
      <CamoBackground opacity={0.1} withGrid>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel-strong border-b border-military-hot-pink/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              <Link href="/dashboard" className="flex items-center gap-3">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Crown className="w-6 h-6 text-white" />
                </motion.div>
                <span className="font-heading text-xl font-bold text-white">SoloSuccess AI</span>
              </Link>

              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <TacticalButton variant="outline" size="sm">
                    Back to Command
                  </TacticalButton>
                </Link>
                <TacticalButton size="sm" onClick={handleSave} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </TacticalButton>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex items-center gap-2 mb-6">
                <RankStars count={5} size="lg" />
                <span className="text-military-hot-pink font-tactical text-sm uppercase tracking-wider">
                  Command Center
                </span>
              </div>

              <h1 className="font-heading text-5xl font-bold text-white mb-6">
                Tactical <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Settings</span>
              </h1>

              <p className="text-xl text-military-storm-grey max-w-2xl">
                Configure your elite command center settings and tactical preferences.
                Customize your experience for maximum efficiency.
              </p>
            </motion.div>

            {/* Settings Tabs */}
            <div className="max-w-6xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="glass-panel-strong border border-military-hot-pink/30">
                  <TabsTrigger value="profile" className="data-[state=active]:bg-military-hot-pink/20 data-[state=active]:text-white">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="security" className="data-[state=active]:bg-military-hot-pink/20 data-[state=active]:text-white">
                    <Shield className="w-4 h-4 mr-2" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="data-[state=active]:bg-military-hot-pink/20 data-[state=active]:text-white">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="data-[state=active]:bg-military-hot-pink/20 data-[state=active]:text-white">
                    <Eye className="w-4 h-4 mr-2" />
                    Privacy
                  </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-8">
                  <GlassCard className="p-8">
                    <h2 className="font-heading text-3xl font-bold text-white mb-6">Tactical Profile</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <Label htmlFor="displayName" className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                          Display Name
                        </Label>
                        <Input
                          id="displayName"
                          type="text"
                          value={formData.displayName}
                          onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                          placeholder="Enter your tactical name"
                          className="bg-military-tactical/50 border-military-hot-pink/30 text-white placeholder-military-storm-grey focus:border-military-hot-pink"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                          Tactical Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="your.email@domain.com"
                          className="bg-military-tactical/50 border-military-hot-pink/30 text-white placeholder-military-storm-grey focus:border-military-hot-pink"
                        />
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-8">
                    <h2 className="font-heading text-3xl font-bold text-white mb-6">Account Information</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                          <Crown className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-heading text-lg font-bold text-white mb-2">Launch Tier</h3>
                        <p className="text-military-storm-grey text-sm">Current subscription</p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                          <Target className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-heading text-lg font-bold text-white mb-2">2 AI Agents</h3>
                        <p className="text-military-storm-grey text-sm">Active agents</p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                          <Heart className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-heading text-lg font-bold text-white mb-2">Member Since</h3>
                        <p className="text-military-storm-grey text-sm">January 2024</p>
                      </div>
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-8">
                  <GlassCard className="p-8">
                    <h2 className="font-heading text-3xl font-bold text-white mb-6">Password Security</h2>

                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="currentPassword" className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-military-storm-grey" />
                          <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            placeholder="Enter current password"
                            className="pl-12 pr-12 py-4 bg-military-tactical/50 border-military-hot-pink/30 text-white placeholder-military-storm-grey focus:border-military-hot-pink"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-military-storm-grey hover:text-military-hot-pink transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="newPassword" className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                            New Password
                          </Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                            placeholder="Enter new password"
                            className="bg-military-tactical/50 border-military-hot-pink/30 text-white placeholder-military-storm-grey focus:border-military-hot-pink"
                          />
                        </div>

                        <div>
                          <Label htmlFor="confirmPassword" className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                            Confirm Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="Confirm new password"
                            className="bg-military-tactical/50 border-military-hot-pink/30 text-white placeholder-military-storm-grey focus:border-military-hot-pink"
                          />
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-8">
                    <h2 className="font-heading text-3xl font-bold text-white mb-6">Security Features</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-military-tactical/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-military-hot-pink" />
                            <span className="text-white font-medium">Two-Factor Authentication</span>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-military-tactical/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-military-hot-pink" />
                            <span className="text-white font-medium">SMS Verification</span>
                          </div>
                          <Switch />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-military-tactical/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-military-hot-pink" />
                            <span className="text-white font-medium">Email Verification</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm">Active</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-military-tactical/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-military-hot-pink" />
                            <span className="text-white font-medium">Login Notifications</span>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-8">
                  <GlassCard className="p-8">
                    <h2 className="font-heading text-3xl font-bold text-white mb-6">Tactical Communications</h2>

                    <div className="space-y-6">
                      {Object.entries(notificationSettings).map(([key, value], index) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-military-tactical/20 rounded-lg">
                          <div>
                            <h3 className="text-white font-medium capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </h3>
                            <p className="text-military-storm-grey text-sm">
                              {key === 'emailNotifications' && 'Receive tactical updates via email'}
                              {key === 'pushNotifications' && 'Get real-time notifications'}
                              {key === 'marketingEmails' && 'Receive promotional content'}
                              {key === 'securityAlerts' && 'Get security and safety alerts'}
                              {key === 'weeklyReports' && 'Weekly performance summaries'}
                              {key === 'productUpdates' && 'New features and improvements'}
                            </p>
                          </div>
                          <Switch
                            checked={value}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, [key]: checked }))}
                          />
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* Privacy Tab */}
                <TabsContent value="privacy" className="space-y-8">
                  <GlassCard className="p-8">
                    <h2 className="font-heading text-3xl font-bold text-white mb-6">Privacy Controls</h2>

                    <div className="space-y-6">
                      <div>
                        <Label className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                          Profile Visibility
                        </Label>
                        <Label htmlFor="email" className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                          Tactical Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="your.email@domain.com"
                          className="bg-military-tactical/50 border-military-hot-pink/30 text-white placeholder-military-storm-grey focus:border-military-hot-pink"
                        />
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-8">
                    <h2 className="font-heading text-3xl font-bold text-white mb-6">Account Information</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                          <Crown className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-heading text-lg font-bold text-white mb-2">Launch Tier</h3>
                        <p className="text-military-storm-grey text-sm">Current subscription</p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                          <Target className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-heading text-lg font-bold text-white mb-2">2 AI Agents</h3>
                        <p className="text-military-storm-grey text-sm">Active agents</p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                          <Heart className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-heading text-lg font-bold text-white mb-2">Member Since</h3>
                        <p className="text-military-storm-grey text-sm">January 2024</p>
                      </div>
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-8">
                  <GlassCard className="p-8">
                    <h2 className="font-heading text-3xl font-bold text-white mb-6">Password Security</h2>

                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="currentPassword" className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-military-storm-grey" />
                          <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            placeholder="Enter current password"
                            className="pl-12 pr-12 py-4 bg-military-tactical/50 border-military-hot-pink/30 text-white placeholder-military-storm-grey focus:border-military-hot-pink"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-military-storm-grey hover:text-military-hot-pink transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="newPassword" className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                            New Password
                          </Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                            placeholder="Enter new password"
                            className="bg-military-tactical/50 border-military-hot-pink/30 text-white placeholder-military-storm-grey focus:border-military-hot-pink"
                          />
                        </div>

                        <div>
                          <Label htmlFor="confirmPassword" className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                            Confirm Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="Confirm new password"
                            className="bg-military-tactical/50 border-military-hot-pink/30 text-white placeholder-military-storm-grey focus:border-military-hot-pink"
                          />
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-8">
                    <h2 className="font-heading text-3xl font-bold text-white mb-6">Security Features</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-military-tactical/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-military-hot-pink" />
                            <span className="text-white font-medium">Two-Factor Authentication</span>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-military-tactical/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-military-hot-pink" />
                            <span className="text-white font-medium">SMS Verification</span>
                          </div>
                          <Switch />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-military-tactical/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-military-hot-pink" />
                            <span className="text-white font-medium">Email Verification</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm">Active</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-military-tactical/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-military-hot-pink" />
                            <span className="text-white font-medium">Login Notifications</span>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-8">
                  <GlassCard className="p-8">
                    <h2 className="font-heading text-3xl font-bold text-white mb-6">Tactical Communications</h2>

                    <div className="space-y-6">
                      {Object.entries(notificationSettings).map(([key, value], index) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-military-tactical/20 rounded-lg">
                          <div>
                            <h3 className="text-white font-medium capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </h3>
                            <p className="text-military-storm-grey text-sm">
                              {key === 'emailNotifications' && 'Receive tactical updates via email'}
                              {key === 'pushNotifications' && 'Get real-time notifications'}
                              {key === 'marketingEmails' && 'Receive promotional content'}
                              {key === 'securityAlerts' && 'Get security and safety alerts'}
                              {key === 'weeklyReports' && 'Weekly performance summaries'}
                              {key === 'productUpdates' && 'New features and improvements'}
                            </p>
                          </div>
                          <Switch
                            checked={value}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, [key]: checked }))}
                          />
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* Privacy Tab */}
                <TabsContent value="privacy" className="space-y-8">
                  <GlassCard className="p-8">
                    <h2 className="font-heading text-3xl font-bold text-white mb-6">Privacy Controls</h2>

                    <div className="space-y-6">
                      <div>
                        <Label className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                          Profile Visibility
                        </Label>
                        <select
                          value={privacySettings.profileVisibility}
                          onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                          className="w-full bg-military-tactical/50 border-military-hot-pink/30 text-white rounded-lg px-4 py-3 focus:border-military-hot-pink focus:outline-none"
                        >
                          <option value="private">Private</option>
                          <option value="public">Public</option>
                          <option value="friends">Friends Only</option>
                        </select>
                      </div>

                      {Object.entries(privacySettings).filter(([key]) => key !== 'profileVisibility').map(([key, value], index) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-military-tactical/20 rounded-lg">
                          <div>
                            <h3 className="text-white font-medium capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </h3>
                            <p className="text-military-storm-grey text-sm">
                              {key === 'dataSharing' && 'Allow data sharing for analytics'}
                              {key === 'analyticsTracking' && 'Track usage for improvements'}
                              {key === 'cookieConsent' && 'Accept cookies for functionality'}
                            </p>
                          </div>
                          <Switch
                            checked={value as boolean}
                            onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, [key]: checked }))}
                          />
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </TabsContent>
              </Tabs>
            </div>

            {/* Danger Zone */}
            <div className="max-w-6xl mx-auto mt-12">
              <GlassCard className="p-8 border-red-500/30">
                <div className="flex items-center gap-4 mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                  <h2 className="font-heading text-3xl font-bold text-white">Danger Zone</h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Sign Out</h3>
                      <p className="text-military-storm-grey text-sm">Sign out of your tactical account</p>
                    </div>
                    <TacticalButton variant="outline" onClick={signOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </TacticalButton>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Delete Account</h3>
                      <p className="text-military-storm-grey text-sm">Permanently delete your tactical account and all data</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <TacticalButton variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </TacticalButton>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-military-tactical border-military-hot-pink/30">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Terminate Tactical Account</AlertDialogTitle>
                          <AlertDialogDescription className="text-military-storm-grey">
                            This action cannot be undone. This will permanently delete your account
                            and remove all tactical data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-military-tactical/50 border-military-hot-pink/30 text-white hover:bg-military-tactical">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            {isDeleting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Terminating...
                              </>
                            ) : (
                              'Terminate Account'
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </CamoBackground>
    </div>
  )
}