"use client"

import type React from "react"

import { useState, } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, } from '@/components/ui/dialog';


import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser, useStackApp } from '@stackframe/stack';
import { Loader2, User, } from 'lucide-react';
interface ProfileModalProps {
  open: boolean
  onOpenChange: (_open: boolean) => void
}

export function ProfileModal(_{ open,   _onOpenChange }: ProfileModalProps) {
  const user = useUser()
  const _stackApp = useStackApp()
  
  const signOut = async () => {
    if (user) {
      await user.signOut()
    }
  }
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [formData, setFormData] = useState({
    full_name: "",
    company_name: "",
    industry: "",
    business_type: "",
    phone: "",
    website: "",
    bio: "",
    timezone: "",
  })

  _(() => {
    if (user) {
      setFormData({
        full_name: user.displayName || "",
        company_name: "",
        industry: "",
        business_type: "",
        phone: "",
        website: "",
        bio: "",
        timezone: "",
      })
    }
  }, [user])

  const handleUpdateProfile = async (_e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    // The original code had updateProfile, deleteAccount, but they are not defined in the useAuth hook.
    // Assuming they are meant to be part of the user object or a separate context.
    // For now, removing them as they are not directly available.
    // const { error } = await updateProfile(formData)

    // if (error) {
    //   setError(error.message || "Failed to update profile")
    // } else {
    //   setSuccess("Profile updated successfully!")
    // }

    setLoading(false)
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    setError(null)

    // The original code had deleteAccount, but it's not defined in the useAuth hook.
    // Assuming it's meant to be part of the user object or a separate context.
    // For now, removing it as it's not directly available.
    // const { error } = await deleteAccount()

    // if (error) {
    //   setError(error.message || "Failed to delete account")
    //   setDeleteLoading(false)
    // } else {
    //   // Account deleted successfully, user will be signed out automatically
    //   await signOut()
    // }
  }

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Consulting",
    "Creative Services",
    "Real Estate",
    "Manufacturing",
    "Other",
  ]

  const businessTypes = [
    "Freelancer",
    "Consultant",
    "E-commerce",
    "SaaS",
    "Agency",
    "Content Creator",
    "Coach/Trainer",
    "Service Provider",
    "Other",
  ]

  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Australia/Sydney",
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <>
          <className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile </>
          <>Manage your account information and preferences</>
        </>

        <defaultValue="profile" className="w-full">
          <className="grid w-full grid-cols-2">
            <value="profile">Profile</>
            <value="account">Account</>
          </>

          <value="profile" className="space-y-4">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/default-user.svg" />
                  <AvatarFallback className="text-lg">
                    {user?.displayName?.charAt(0) || user?.primaryEmail?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button type="button" variant="outline" size="sm">
                    <className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <htmlFor="full_name">Full Name</>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(_e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <htmlFor="email">Email</>
                  <Input id="email" value={user?.primaryEmail || ""} disabled className="bg-muted" />
                </div>
              </div>

              {/* Business Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <htmlFor="company_name">Company Name</>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(_e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Your company name"
                  />
                </div>
                <div className="space-y-2">
                  <htmlFor="industry">Industry</>
                  <Select
                    value={formData.industry}
                    onValueChange={(_value) => setFormData({ ...formData, industry: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(_(industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <htmlFor="business_type">Business Type</>
                  <Select
                    value={formData.business_type}
                    onValueChange={(_value) => setFormData({ ...formData, business_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map(_(type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <htmlFor="timezone">Timezone</>
                  <Select
                    value={formData.timezone}
                    onValueChange={(_value) => setFormData({ ...formData, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map(_(tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <htmlFor="phone">Phone</>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(_e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <htmlFor="website">Website</>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(_e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <htmlFor="bio">Bio</>
                <id="bio"
                  value={formData.bio}
                  onChange={(_e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself and your business..."
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Profile...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </>

          <value="account" className="space-y-4">
            <div className="space-y-6">
              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Information</h3>
                <div className="grid gap-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Email Address</p>
                      <p className="text-sm text-muted-foreground">{user?.primaryEmail}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Email
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-sm text-muted-foreground">Last updated 30 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Actions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Sign Out</p>
                      <p className="text-sm text-muted-foreground">Sign out of your account</p>
                    </div>
                    <Button variant="outline" onClick={signOut}>
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-red-800">Delete Account</p>
                      <p className="text-sm text-red-600 mt-1">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} className="ml-4">
                      <className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        </>

        {error && (
          <className="border-red-200 bg-red-50">
            <className="h-4 w-4" />
            <className="text-red-800">{error}</>
          </>
        )}

        {success && (
          <className="border-green-200 bg-green-50">
            <className="text-green-800">{success}</>
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <>
              <className="flex items-center gap-2 text-red-600">
                <className="h-5 w-5" />
                Delete Account
              </>
              <>
                Are you absolutely sure you want to delete your account? This action cannot be undone and will
                permanently delete:
              </>
            </>
            <div className="space-y-2 text-sm">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Your profile and personal information</li>
                <li>All your goals and tasks</li>
                <li>Chat conversations with AI team members</li>
                <li>All other associated data</li>
              </ul>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleteLoading}>
                {deleteLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}
