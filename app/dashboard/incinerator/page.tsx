"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    Flame,
    AlertTriangle,
    RefreshCw,
    ArrowRight,
    Target,
    Users,
    Zap
} from "lucide-react"
import {
    GlassCard,
    TacticalButton,
    CamoBackground,
    TacticalGrid,
    StatsBadge
} from "@/components/military"
import { toast } from "sonner"

interface IncineratorResult {
    score: number
    feedback: string[]
    pivots: string[]
    marketContext: string
}

export default function IncineratorPage() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<IncineratorResult | null>(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        targetAudience: "",
        problemSolved: ""
    })

    const handleIncinerate = async () => {
        if (!formData.title || !formData.description) {
            toast.error("Please provide at least a title and description.")
            return
        }

        setLoading(true)
        setResult(null)

        try {
            const response = await fetch('/api/incinerator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error('Incineration failed')
            }

            const data = await response.json()
            setResult(data)
            toast.success("Idea incinerated successfully!")
        } catch (error) {
            toast.error("Failed to incinerate idea. Please try again.")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-military-midnight p-6 relative overflow-hidden">
            <CamoBackground />
            <TacticalGrid />

            <div className="max-w-4xl mx-auto relative z-10 space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-full mb-4 ring-1 ring-red-500/50"
                    >
                        <Flame className="w-12 h-12 text-red-500 animate-pulse" />
                    </motion.div>
                    <h1 className="text-4xl font-heading font-bold text-military-glass-white">
                        Idea Incinerator
                    </h1>
                    <p className="text-xl text-military-storm-grey max-w-2xl mx-auto">
                        Brutal validation for your business ideas. We burn away the fluff to see if anything solid remains.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <GlassCard className="p-6 space-y-6" glow>
                        <h2 className="text-xl font-bold text-military-glass-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-500" />
                            Idea Parameters
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-military-storm-grey">Idea Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Uber for Dog Walking"
                                    className="w-full bg-military-tactical/50 border border-military-gunmetal rounded-lg p-3 text-military-glass-white focus:border-military-hot-pink focus:ring-1 focus:ring-military-hot-pink transition-all outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-military-storm-grey">Problem Solved</label>
                                <textarea
                                    value={formData.problemSolved}
                                    onChange={(e) => setFormData({ ...formData, problemSolved: e.target.value })}
                                    placeholder="What specific pain point are you addressing?"
                                    rows={3}
                                    className="w-full bg-military-tactical/50 border border-military-gunmetal rounded-lg p-3 text-military-glass-white focus:border-military-hot-pink focus:ring-1 focus:ring-military-hot-pink transition-all outline-none resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-military-storm-grey">Target Audience</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-3 w-5 h-5 text-military-storm-grey" />
                                    <input
                                        type="text"
                                        value={formData.targetAudience}
                                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                        placeholder="Who is desperate for this?"
                                        className="w-full bg-military-tactical/50 border border-military-gunmetal rounded-lg p-3 pl-10 text-military-glass-white focus:border-military-hot-pink focus:ring-1 focus:ring-military-hot-pink transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-military-storm-grey">Description / Solution</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="How does it work? Be specific."
                                    rows={4}
                                    className="w-full bg-military-tactical/50 border border-military-gunmetal rounded-lg p-3 text-military-glass-white focus:border-military-hot-pink focus:ring-1 focus:ring-military-hot-pink transition-all outline-none resize-none"
                                />
                            </div>

                            <TacticalButton
                                onClick={handleIncinerate}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 border-none"
                                size="lg"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                        Incinerating...
                                    </>
                                ) : (
                                    <>
                                        <Flame className="w-5 h-5 mr-2" />
                                        Incinerate Idea
                                    </>
                                )}
                            </TacticalButton>
                        </div>
                    </GlassCard>

                    {/* Results Display */}
                    <div className="space-y-6">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Score Card */}
                                <GlassCard className="p-8 text-center relative overflow-hidden" glow>
                                    <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none" />
                                    <h3 className="text-lg font-medium text-military-storm-grey mb-4">Survival Score</h3>
                                    <div className="relative inline-flex items-center justify-center">
                                        <svg className="w-32 h-32 transform -rotate-90">
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="60"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                className="text-military-gunmetal"
                                            />
                                            <motion.circle
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: result.score / 100 }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                cx="64"
                                                cy="64"
                                                r="60"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                className={`${result.score > 70 ? 'text-green-500' :
                                                        result.score > 40 ? 'text-yellow-500' : 'text-red-500'
                                                    }`}
                                                strokeDasharray="377"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                                            <span className="text-4xl font-bold text-military-glass-white">{result.score}</span>
                                            <span className="text-xs text-military-storm-grey">/ 100</span>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-military-glass-white font-medium">
                                        {result.score > 70 ? "Solid Foundation" :
                                            result.score > 40 ? "Needs Major Work" : "Burnt to a Crisp"}
                                    </p>
                                </GlassCard>

                                {/* Feedback "Ashes" */}
                                <GlassCard className="p-6" glow>
                                    <h3 className="text-lg font-bold text-military-glass-white mb-4 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                        The Ashes (Critical Feedback)
                                    </h3>
                                    <ul className="space-y-3">
                                        {result.feedback.map((item, i) => (
                                            <motion.li
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-start gap-3 text-military-storm-grey"
                                            >
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                                <span>{item}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </GlassCard>

                                {/* Pivots "Phoenix" */}
                                <GlassCard className="p-6" glow>
                                    <h3 className="text-lg font-bold text-military-glass-white mb-4 flex items-center gap-2">
                                        <RefreshCw className="w-5 h-5 text-green-500" />
                                        The Phoenix (Pivot Suggestions)
                                    </h3>
                                    <div className="space-y-3">
                                        {result.pivots.map((pivot, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + (i * 0.1) }}
                                                className="p-3 bg-military-tactical/30 rounded-lg border border-military-gunmetal/50"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <ArrowRight className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-military-glass-white text-sm">{pivot}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ) : (
                            <div className="h-full flex items-center justify-center min-h-[400px]">
                                <div className="text-center space-y-4 opacity-50">
                                    <Target className="w-16 h-16 mx-auto text-military-gunmetal" />
                                    <p className="text-military-storm-grey">
                                        Enter your idea details to begin the incineration process.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
