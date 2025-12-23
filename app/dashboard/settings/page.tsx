"use client"

export const dynamic = 'force-dynamic'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  User,
  Shield,
  Bell,
  CreditCard,
  LogOut,
  Save,
  Trash2,
  Crown,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Settings as SettingsIcon
} from 'lucide-react'
import { HudBorder } from '@/components/cyber/HudBorder'
import { PrimaryButton } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from 'next/link'
import { SocialMediaIntegration } from '@/components/integrations/social-media-integration'
import { CalendarIntegration } from '@/components/integrations/calendar-integration'
import { RevenueIntegration } from '@/components/integrations/revenue-integration'

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
    profileVisibility: 'public',
    showActivity: true,
    allowTagging: true,
    dataSharing: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Call API to update profile
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.displayName,
          email: formData.email,
          // Only send password if it's being changed
          ...(formData.newPassword ? {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          } : {}),
          notifications: notificationSettings,
          privacy: privacySettings
        })
      })

      if (response.ok) {
        toast({
          title: "Settings Saved",
          description: "Your profile has been updated successfully.",
        })
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted.",
          variant: "destructive"
        })
        signOut()
      } else {
        throw new Error('Failed to delete account')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      toast({
        title: "Error",
        description: "Failed to delete account. Please contact support.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 pointer-events-none" />
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-card/90 backdrop-blur-sm border-b border-neon-purple/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              <Link href="/dashboard" className="flex items-center gap-3">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-magenta flex items-center justify-center shadow-[0_0_20px_rgba(179,0,255,0.4)]"
                  whileHover={{ scale: 1.05 }}
                >
                  <Crown className="w-6 h-6 text-white" />
                </motion.div>
                <span className="font-sci text-xl font-bold text-white">SOLOSUCCESS AI</span>
              </Link>

              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <PrimaryButton variant="outline" size="sm" className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10">
                    Back to Command
                  </PrimaryButton>
                </Link>
                <PrimaryButton size="sm" onClick={handleSave} disabled={isLoading} className="bg-neon-purple hover:bg-neon-purple/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </PrimaryButton>
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
                <span className="text-neon-purple font-tech text-sm uppercase tracking-wider">
                  Command Center
                </span>
              </div>

              <h1 className="font-sci text-5xl font-bold text-white mb-6">
                SETTINGS <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-magenta">CONFIGURATION</span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl font-tech">
                Configure your command center settings and preferences.
                Customize your experience for maximum efficiency.
              </p>
            </motion.div>

            {/* Settings Tabs */}
            <div className="max-w-6xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="bg-dark-card border border-neon-purple/30">
                  <TabsTrigger value="profile" className="data-[state=active]:bg-neon-purple/20 data-[state=active]:text-white font-tech">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="security" className="data-[state=active]:bg-neon-purple/20 data-[state=active]:text-white font-tech">
                    <Shield className="w-4 h-4 mr-2" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="data-[state=active]:bg-neon-purple/20 data-[state=active]:text-white font-tech">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="integrations" className="data-[state=active]:bg-neon-purple/20 data-[state=active]:text-white font-tech">
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    Integrations
                  </TabsTrigger>
                  <TabsTrigger value="billing" className="data-[state=active]:bg-neon-purple/20 data-[state=active]:text-white font-tech">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing
                  </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                  <HudBorder variant="hover" className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-lg bg-neon-purple/20 flex items-center justify-center border border-neon-purple/30">
                        <User className="w-6 h-6 text-neon-purple" />
                      </div>
                      <div>
                        <h3 className="text-xl font-sci font-bold text-white">Profile Information</h3>
                        <p className="text-gray-400 font-tech">Update your personal details and public profile</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="displayName" className="text-neon-cyan font-tech uppercase text-xs">Display Name</Label>
                          <Input
                            id="displayName"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleInputChange}
                            className="bg-dark-bg border-neon-cyan/30 text-white focus:border-neon-cyan"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-neon-cyan font-tech uppercase text-xs">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-dark-bg border-neon-cyan/30 text-white focus:border-neon-cyan"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio" className="text-neon-cyan font-tech uppercase text-xs">Bio</Label>
                          <Input
                            id="bio"
                            className="bg-dark-bg border-neon-cyan/30 text-white focus:border-neon-cyan"
                            placeholder="Tell us about your mission..."
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="p-4 rounded-lg bg-dark-bg/50 border border-neon-purple/30">
                          <h4 className="text-white font-bold mb-2 font-sci">Profile Visibility</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm font-tech">Make profile public</span>
                            <Switch
                              checked={privacySettings.profileVisibility === 'public'}
                              onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, profileVisibility: checked ? 'public' : 'private' }))}
                            />
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-dark-bg/50 border border-neon-purple/30">
                          <h4 className="text-white font-bold mb-2 font-sci">Activity Status</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm font-tech">Show online status</span>
                            <Switch
                              checked={privacySettings.showActivity}
                              onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showActivity: checked }))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </HudBorder>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                  <HudBorder variant="hover" className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-lg bg-neon-purple/20 flex items-center justify-center border border-neon-purple/30">
                        <Shield className="w-6 h-6 text-neon-purple" />
                      </div>
                      <div>
                        <h3 className="text-xl font-sci font-bold text-white">Security Settings</h3>
                        <p className="text-gray-400 font-tech">Manage your password and account security</p>
                      </div>
                    </div>

                    <div className="space-y-6 max-w-2xl">
                      <div className="space-y-4">
                        <h4 className="text-white font-bold font-sci">Change Password</h4>
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="text-neon-cyan font-tech uppercase text-xs">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type={showPassword ? "text" : "password"}
                              value={formData.currentPassword}
                              onChange={handleInputChange}
                              className="bg-dark-bg border-neon-cyan/30 text-white pr-10 focus:border-neon-cyan"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-neon-cyan"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-neon-cyan font-tech uppercase text-xs">New Password</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="bg-dark-bg border-neon-cyan/30 text-white focus:border-neon-cyan"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-neon-cyan font-tech uppercase text-xs">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="bg-dark-bg border-neon-cyan/30 text-white focus:border-neon-cyan"
                          />
                        </div>
                      </div>

                      <div className="h-px bg-neon-cyan/30 my-6" />

                      <div className="space-y-4">
                        <h4 className="text-neon-magenta font-bold flex items-center gap-2 font-sci">
                          <AlertTriangle className="w-5 h-5" />
                          Danger Zone
                        </h4>
                        <div className="p-4 rounded-lg border border-neon-magenta/30 bg-neon-magenta/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="text-white font-bold font-sci">Delete Account</h5>
                              <p className="text-gray-400 text-sm font-tech">Permanently delete your account and all data</p>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="magenta" size="sm" className="bg-neon-magenta hover:bg-neon-magenta/90">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Account
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-dark-card border-neon-magenta/30 text-white">
                                <DialogHeader>
                                  <DialogTitle className="font-sci">Are you absolutely sure?</DialogTitle>
                                  <DialogDescription className="text-gray-400 font-tech">
                                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline" className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10">Cancel</Button>
                                  <Button
                                    variant="magenta"
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                    className="bg-neon-magenta hover:bg-neon-magenta/90"
                                  >
                                    {isDeleting ? "Deleting..." : "Yes, delete account"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </HudBorder>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications">
                  <HudBorder variant="hover" className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-lg bg-neon-purple/20 flex items-center justify-center border border-neon-purple/30">
                        <Bell className="w-6 h-6 text-neon-purple" />
                      </div>
                      <div>
                        <h3 className="text-xl font-sci font-bold text-white">Notification Preferences</h3>
                        <p className="text-gray-400 font-tech">Control how and when we communicate with you</p>
                      </div>
                    </div>

                    <div className="space-y-6 max-w-2xl">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-dark-bg/50 border border-neon-purple/30">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-neon-purple" />
                            <div>
                              <h5 className="text-white font-bold font-sci">Email Notifications</h5>
                              <p className="text-gray-400 text-sm font-tech">Receive updates via email</p>
                            </div>
                          </div>
                          <Switch
                            checked={notificationSettings.emailNotifications}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-dark-bg/50 border border-neon-purple/30">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-neon-purple" />
                            <div>
                              <h5 className="text-white font-bold font-sci">Push Notifications</h5>
                              <p className="text-gray-400 text-sm font-tech">Receive mobile push notifications</p>
                            </div>
                          </div>
                          <Switch
                            checked={notificationSettings.pushNotifications}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-dark-bg/50 border border-neon-purple/30">
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-neon-purple" />
                            <div>
                              <h5 className="text-white font-bold font-sci">Security Alerts</h5>
                              <p className="text-gray-400 text-sm font-tech">Get notified about security events</p>
                            </div>
                          </div>
                          <Switch
                            checked={notificationSettings.securityAlerts}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, securityAlerts: checked }))}
                          />
                        </div>
                      </div>
                    </div>
                  </HudBorder>
                </TabsContent>

                {/* Integrations Tab */}
                <TabsContent value="integrations">
                  <div className="space-y-6">
                    <HudBorder variant="hover" className="p-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-lg bg-neon-purple/20 flex items-center justify-center border border-neon-purple/30">
                          <SettingsIcon className="w-6 h-6 text-neon-purple" />
                        </div>
                        <div>
                          <h3 className="text-xl font-sci font-bold text-white">Third-Party Integrations</h3>
                          <p className="text-gray-400 font-tech">Connect your accounts and services for enhanced functionality</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <RevenueIntegration />
                        <SocialMediaIntegration />
                        <CalendarIntegration />
                      </div>
                    </HudBorder>
                  </div>
                </TabsContent>

                {/* Billing Tab Redirect */}
                <TabsContent value="billing">
                  <HudBorder variant="hover" className="p-8 text-center">
                    <CreditCard className="w-16 h-16 text-neon-purple mx-auto mb-4" />
                    <h3 className="text-2xl font-sci font-bold text-white mb-2">Manage Subscription</h3>
                    <p className="text-gray-400 mb-6 font-tech">
                      View your plan details, billing history, and payment methods in the dedicated billing portal.
                    </p>
                    <Link href="/dashboard/billing">
                      <PrimaryButton size="lg" className="bg-neon-purple hover:bg-neon-purple/90">
                        Go to Billing Portal
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </PrimaryButton>
                    </Link>
                  </HudBorder>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
    </div>
  )
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}