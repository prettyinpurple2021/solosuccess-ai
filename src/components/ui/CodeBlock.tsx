'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  showLineNumbers?: boolean
  glitch?: boolean
  copyable?: boolean
  className?: string
}

export const CodeBlock = ({ 
  code,
  language = 'javascript',
  showLineNumbers = true,
  glitch = false,
  copyable = true,
  className = ''
}: CodeBlockProps) => {
  const [copied, setCopied] = React.useState(false)
  // Theme not available during static generation - use defaults
  const theme = undefined
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const lines = code.split('\n')
  
  return (
    <div className={cn(
      'border-2 border-neon-cyan',
      'bg-dark-card',
      theme === 'aggressive' ? 'rounded-none' : 'rounded-sm',
      'overflow-hidden',
      'shadow-[0_0_20px_rgba(11,228,236,0.2)]',
      className
    )}>
      {/* Header */}
      <div className="border-b-2 border-neon-cyan px-4 py-2 flex justify-between items-center bg-dark-hover">
        <span className="text-neon-cyan text-xs font-mono uppercase">{language}</span>
        {copyable && (
          <button
            onClick={handleCopy}
            className="text-neon-cyan hover:text-neon-lime text-xs font-mono uppercase transition-colors"
            aria-label="Copy code"
          >
            {copied ? 'COPIED' : 'COPY'}
          </button>
        )}
      </div>
      
      {/* Code */}
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-sm text-gray-300">
          {lines.map((line, idx) => (
            <div key={idx} className="flex">
              {showLineNumbers && (
                <span className="text-gray-600 mr-4 w-8 text-right select-none">{idx + 1}</span>
              )}
              <code className={glitch ? 'glitch-hover' : ''} data-text={line}>{line}</code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}
