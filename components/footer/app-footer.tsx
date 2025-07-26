"use client"

import Link from "next/link"
import { Crown, Heart, Sparkles, Twitter, Instagram, Linkedin, Github, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const footerLinks = {
  product: [
    { name: "BossRoom Dashboard", href: "/" },
    { name: "AI Squad", href: "/team" },
    { name: "SlayList Goals", href: "/slaylist" },
    { name: "BrandStyler", href: "/brand" },
    { name: "Focus Mode", href: "/focus" },
    { name: "Burnout Shield", href: "/burnout" },
  ],
  company: [
    { name: "About SoloBoss", href: "/about" },
    { name: "Boss Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Press Kit", href: "/press" },
    { name: "Boss Community", href: "/community" },
  ],
  resources: [
    { name: "Help Center", href: "/help" },
    { name: "API Docs", href: "/docs" },
    { name: "Boss Academy", href: "/academy" },
    { name: "Templates", href: "/templates" },
    { name: "Integrations", href: "/integrations" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "GDPR", href: "/gdpr" },
  ],
}

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com/solobossai", icon: Twitter },
  { name: "Instagram", href: "https://instagram.com/solobossai", icon: Instagram },
  { name: "LinkedIn", href: "https://linkedin.com/company/solobossai", icon: Linkedin },
  { name: "GitHub", href: "https://github.com/solobossai", icon: Github },
]

export function AppFooter() {
  return (
    <footer className="bg-gradient-to-b from-purple-50 to-white border-t-2 border-purple-200">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6" />
              <h3 className="text-2xl font-bold boss-heading">Join the Boss Revolution!</h3>
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Get exclusive boss tips, AI updates, and empire-building strategies delivered to your inbox. No spam, just
              pure boss energy! 💪✨
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your boss email..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
              />
              <Button
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 bounce-on-hover"
              >
                Subscribe 🚀
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <img
                  src="/images/logo.png"
                  alt="SoloBoss AI"
                  className="h-12 w-12 rounded-xl object-contain punk-shadow"
                />
                <Crown className="absolute -top-1 -right-1 h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold boss-heading bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  SoloBoss AI
                </h2>
                <p className="text-sm text-gray-600 font-medium">Solo Entrepreneur Empire</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Empowering solo entrepreneurs to build their empires with AI-powered virtual teams. Turn your solo hustle
              into a boss-level business with our punk rock productivity platform! 👑
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg hover:from-purple-200 hover:to-pink-200 transition-all duration-200 bounce-on-hover"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-5 w-5 text-purple-600" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 empowering-text">Product 🚀</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 empowering-text">Company 🏢</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 empowering-text">Resources 📚</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 empowering-text">Legal ⚖️</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-200 font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator className="bg-purple-200" />

      {/* Bottom Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <span>© 2025 SoloBoss AI. Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for boss babes everywhere.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <Link href="/status" className="hover:text-purple-600 transition-colors font-medium">
              System Status
            </Link>
            <Link href="/security" className="hover:text-purple-600 transition-colors font-medium">
              Security
            </Link>
            <Link
              href="/contact"
              className="hover:text-purple-600 transition-colors font-medium flex items-center gap-1"
            >
              <Mail className="h-4 w-4" />
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
