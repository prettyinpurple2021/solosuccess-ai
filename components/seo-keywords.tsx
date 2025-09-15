"use client"

import { motion } from "framer-motion"

const keywords = [
  "AI Co-founder",
  "AI Business Co-pilot",
  "Virtual Team for Founders",
  "Solopreneur Operating System",
  "AI Business Assistant",
  "Startup AI Platform",
  "Founder AI Tools",
  "One-Person Business Software",
  "Solo Founder",
  "Solopreneur",
  "Freelancer Tools",
  "Individual Creator",
  "Bootstrapped Founder",
  "E-commerce Entrepreneur",
  "Small Business Owner",
  "Consultant Software",
  "Founder Burnout",
  "Reduce Context Switching",
  "Overcome Decision Fatigue",
  "Scale a Solo Business",
  "Business Automation",
  "Strategic Planning Tools",
  "Streamline Operations",
  "How to Grow a Business Alone",
  "AI Marketing Assistant",
  "AI Sales Strategist",
  "Automated Content Creation",
  "AI for Social Media",
  "Business Intelligence Tools",
  "Workflow Automation AI",
  "AI Executive Assistant",
  "AI-powered Productivity",
]

export function SeoKeywordsCloud() {
  return (
    <div className="container-responsive">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {keywords.map((word, index) => (
          <motion.div
            key={word}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.03 }}
            className="text-center text-sm md:text-base font-medium px-3 py-2 rounded-full bg-white/70 dark:bg-slate-900/60 border border-purple-200/60 dark:border-teal-900/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            {word}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default SeoKeywordsCloud


