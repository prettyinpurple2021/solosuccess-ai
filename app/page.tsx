"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AuthModal } from "@/components/auth/auth-modal"
import { Crown, Sparkles, Zap, Brain, Target, Star, CheckCircle, Play, BarChart3, Shield, Rocket } from "lucide-react"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: Crown,
      title: "AI Squad Leadership",
      description:
        "Command your personal army of 8 specialized AI agents, each with unique personalities and boss-level skills.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Brain,
      title: "Smart Task Slaying",
      description:
        "AI-powered task management that learns your style and automatically prioritizes your empire-building moves.",
      color: "from-teal-500 to-purple-500",
    },
    {
      icon: Zap,
      title: "Instant Automation",
      description:
        "Automate the boring stuff so you can focus on what matters - building your legendary business empire.",
      color: "from-pink-500 to-purple-500",
    },
    {
      icon: Target,
      title: "Goal Crushing System",
      description: "Set ambitious goals and watch our AI help you demolish them with strategic planning and execution.",
      color: "from-purple-500 to-teal-500",
    },
    {
      icon: BarChart3,
      title: "Boss Analytics",
      description:
        "Get insights that would make Fortune 500 CEOs jealous. Track everything that matters to your success.",
      color: "from-teal-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "Burnout Protection",
      description: "AI-powered wellness monitoring keeps you performing at peak boss level without burning out.",
      color: "from-pink-500 to-teal-500",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "E-commerce Boss",
      avatar: "/placeholder.svg?height=60&width=60",
      quote: "SoloBoss AI turned me from overwhelmed solopreneur to confident CEO. My revenue tripled in 6 months! 🚀",
      rating: 5,
    },
    {
      name: "Maya Rodriguez",
      role: "Digital Marketing Queen",
      avatar: "/placeholder.svg?height=60&width=60",
      quote:
        "The AI agents feel like having a whole team. Roxy handles my schedule, Echo creates killer content. Game changer! 💪",
      rating: 5,
    },
    {
      name: "Alex Thompson",
      role: "Tech Startup Founder",
      avatar: "/placeholder.svg?height=60&width=60",
      quote:
        "Finally, a platform that gets the solo entrepreneur struggle. It's like having a co-founder who never sleeps! ✨",
      rating: 5,
    },
  ]

  const pricingPlans = [
    {
      name: "Boss Starter",
      price: "Free",
      period: "",
      description: "Perfect for new bosses getting started",
      features: [
        "2 AI Squad Members",
        "Basic Task Management",
        "Limited Analytics",
        "Mobile App Access",
        "Community Access",
      ],
      popular: false,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: "Empire Builder",
      price: "$20",
      period: "/month",
      description: "For bosses scaling their empire",
      features: [
        "Full 8-Agent AI Squad",
        "Advanced Automation",
        "Predictive Analytics",
        "Voice Chat with Agents",
        "Priority Support",
        "Custom Integrations",
      ],
      popular: true,
      gradient: "from-teal-500 to-purple-500",
    },
    {
      name: "Legendary Boss",
      price: "$49",
      period: "/month",
      description: "For bosses building business empires",
      features: [
        "Everything in Empire Builder",
        "Custom AI Training",
        "White-label Options",
        "Dedicated Success Manager",
        "Advanced Wellness Tracking",
        "API Access",
      ],
      popular: false,
      gradient: "from-pink-500 to-teal-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-teal-50/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                SoloBoss AI
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="font-medium hover:text-purple-600 transition-colors">
                Features
              </a>
              <a href="#testimonials" className="font-medium hover:text-purple-600 transition-colors">
                Success Stories
              </a>
              <a href="#pricing" className="font-medium hover:text-purple-600 transition-colors">
                Pricing
              </a>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-semibold"
              >
                Start Building Empire
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="mb-6 text-lg px-6 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
              <Sparkles className="mr-2 h-4 w-4" />
              The Future of Solo Entrepreneurship
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block">
                Build Your Empire
              </span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block">
                With AI Squad Power
              </span>
              <span className="text-4xl md:text-5xl block mt-4">👑✨💪</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto font-medium leading-relaxed">
              Stop being a solo struggle-preneur. Command your personal army of 8 specialized AI agents and transform
              into the <span className="text-purple-600 font-bold">legendary boss</span> you were meant to be.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button
                size="lg"
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-bold text-lg px-8 py-4 transform hover:scale-105 transition-all duration-200"
              >
                <Rocket className="mr-3 h-6 w-6" />
                Start Your Empire Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-purple-300 hover:border-purple-500 font-bold text-lg px-8 py-4 bg-transparent"
              >
                <Play className="mr-3 h-5 w-5" />
                Watch Boss Demo
              </Button>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  10,000+
                </div>
                <div className="text-gray-600 font-medium">Boss Babes Empowered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  300%
                </div>
                <div className="text-gray-600 font-medium">Average Revenue Growth</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <div className="text-gray-600 font-medium">AI Squad Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-50/50 to-teal-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Why Boss Babes Choose SoloBoss AI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Every feature designed to transform you from overwhelmed solopreneur to confident empire builder
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 border-purple-100 hover:border-purple-300 transition-all duration-200 hover:scale-105"
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 font-medium leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Squad Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Meet Your AI Squad
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              8 specialized AI agents, each with unique personalities and boss-level skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Roxy", role: "Executive Assistant", mood: "💪", color: "from-purple-500 to-pink-500" },
              { name: "Blaze", role: "Growth Strategist", mood: "🔥", color: "from-pink-500 to-purple-500" },
              { name: "Echo", role: "Marketing Maven", mood: "✨", color: "from-teal-500 to-purple-500" },
              { name: "Nova", role: "Creative Director", mood: "🎨", color: "from-purple-500 to-teal-500" },
              { name: "Lexi", role: "Data Analyst", mood: "📊", color: "from-teal-500 to-pink-500" },
              { name: "Vex", role: "Tech Specialist", mood: "⚡", color: "from-pink-500 to-teal-500" },
              { name: "Lumi", role: "Legal Advisor", mood: "🛡️", color: "from-purple-500 to-pink-500" },
              { name: "Glitch", role: "Innovation Agent", mood: "🚀", color: "from-teal-500 to-purple-500" },
            ].map((agent, index) => (
              <Card key={index} className="text-center hover:scale-105 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 shadow-lg overflow-hidden">
                    <img
                      src={`/images/agents/${agent.name.toLowerCase()}.png`}
                      alt={agent.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{agent.name}</h3>
                  <p className="text-sm text-gray-600 font-medium">{agent.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-50/50 to-purple-50/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Boss Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Real bosses, real results, real empire building
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:scale-105 transition-all duration-200">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 font-medium italic leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover shadow-md"
                    />
                    <div>
                      <div className="font-bold text-gray-800">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 font-medium">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Choose Your Boss Level
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Every plan designed to scale with your empire-building ambitions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? "ring-4 ring-purple-300 scale-105" : ""} hover:scale-105 transition-all duration-200`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 text-sm px-4 py-1">
                      <Crown className="mr-1 h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 font-medium">{plan.period}</span>
                  </div>
                  <CardDescription className="font-medium">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" />
                        <span className="font-medium text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-bold py-3 ${plan.popular ? "animate-pulse" : ""}`}
                  >
                    Start Building Empire
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Build Your Empire?</h2>
          <p className="text-xl mb-12 opacity-90 font-medium leading-relaxed">
            Join thousands of boss babes who've transformed from overwhelmed solopreneurs to confident empire builders.
            Your AI squad is waiting! 👑
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-8">
            <Input
              type="email"
              placeholder="Enter your boss email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70 font-medium"
            />
            <Button
              size="lg"
              onClick={() => setShowAuthModal(true)}
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 transform hover:scale-105 transition-all duration-200"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Start Free
            </Button>
          </div>

          <p className="text-sm opacity-75 font-medium">
            ✨ 14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Crown className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold">SoloBoss AI</span>
              </div>
              <p className="text-gray-400 font-medium leading-relaxed">
                Empowering solo entrepreneurs to build legendary business empires with AI-powered squad support.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-purple-400">Platform</h3>
              <ul className="space-y-2 text-gray-400 font-medium">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    AI Squad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-teal-400">Resources</h3>
              <ul className="space-y-2 text-gray-400 font-medium">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Boss Academy
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-white transition-colors">
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Docs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-pink-400">Company</h3>
              <ul className="space-y-2 text-gray-400 font-medium">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 font-medium">© 2024 SoloBoss AI. Built by boss babes, for boss babes. 👑✨</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
