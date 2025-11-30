#!/usr/bin/env node

/**
 * Script to convert inline styles to Tailwind CSS classes or CSS custom properties
 * This script will:
 * 1. Find inline styles that can be converted to Tailwind classes
 * 2. Convert simple inline styles to Tailwind equivalents
 * 3. Leave dynamic styles that require CSS custom properties
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const PROJECT_ROOT = path.resolve(__dirname, '..')
const EXCLUDE_DIRS = ['node_modules', '.next', '.git', 'dist', 'build']
const INCLUDE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js']

// Common inline style to Tailwind class mappings
const STYLE_MAPPINGS = {
  // Colors
  'backgroundColor: \'#ffffff\'': 'bg-white',
  'backgroundColor: \'#000000\'': 'bg-black',
  'backgroundColor: \'#f3f4f6\'': 'bg-gray-100',
  'backgroundColor: \'#e5e7eb\'': 'bg-gray-200',
  'backgroundColor: \'#d1d5db\'': 'bg-gray-300',
  'backgroundColor: \'#9ca3af\'': 'bg-gray-400',
  'backgroundColor: \'#6b7280\'': 'bg-gray-500',
  'backgroundColor: \'#4b5563\'': 'bg-gray-600',
  'backgroundColor: \'#374151\'': 'bg-gray-700',
  'backgroundColor: \'#1f2937\'': 'bg-gray-800',
  'backgroundColor: \'#111827\'': 'bg-gray-900',
  'backgroundColor: \'#3b82f6\'': 'bg-blue-500',
  'backgroundColor: \'#10b981\'': 'bg-green-500',
  'backgroundColor: \'#f59e0b\'': 'bg-yellow-500',
  'backgroundColor: \'#ef4444\'': 'bg-red-500',
  'backgroundColor: \'#8b5cf6\'': 'bg-purple-500',
  
  // Text colors
  'color: \'#ffffff\'': 'text-white',
  'color: \'#000000\'': 'text-black',
  'color: \'#6b7280\'': 'text-gray-500',
  'color: \'#374151\'': 'text-gray-700',
  'color: \'#1f2937\'': 'text-gray-800',
  'color: \'#111827\'': 'text-gray-900',
  'color: \'#3b82f6\'': 'text-blue-500',
  'color: \'#10b981\'': 'text-green-500',
  'color: \'#f59e0b\'': 'text-yellow-500',
  'color: \'#ef4444\'': 'text-red-500',
  
  // Spacing
  'padding: \'8px\'': 'p-2',
  'padding: \'16px\'': 'p-4',
  'padding: \'24px\'': 'p-6',
  'padding: \'32px\'': 'p-8',
  'margin: \'8px\'': 'm-2',
  'margin: \'16px\'': 'm-4',
  'margin: \'24px\'': 'm-6',
  'margin: \'32px\'': 'm-8',
  
  // Display
  'display: \'flex\'': 'flex',
  'display: \'block\'': 'block',
  'display: \'inline-block\'': 'inline-block',
  'display: \'none\'': 'hidden',
  
  // Flexbox
  'flexDirection: \'column\'': 'flex-col',
  'flexDirection: \'row\'': 'flex-row',
  'justifyContent: \'center\'': 'justify-center',
  'justifyContent: \'space-between\'': 'justify-between',
  'justifyContent: \'space-around\'': 'justify-around',
  'alignItems: \'center\'': 'items-center',
  'alignItems: \'flex-start\'': 'items-start',
  'alignItems: \'flex-end\'': 'items-end',
  
  // Text
  'textAlign: \'center\'': 'text-center',
  'textAlign: \'left\'': 'text-left',
  'textAlign: \'right\'': 'text-right',
  'fontWeight: \'bold\'': 'font-bold',
  'fontWeight: \'600\'': 'font-semibold',
  'fontWeight: \'500\'': 'font-medium',
  'fontSize: \'12px\'': 'text-xs',
  'fontSize: \'14px\'': 'text-sm',
  'fontSize: \'16px\'': 'text-base',
  'fontSize: \'18px\'': 'text-lg',
  'fontSize: \'20px\'': 'text-xl',
  'fontSize: \'24px\'': 'text-2xl',
  'fontSize: \'30px\'': 'text-3xl',
  'fontSize: \'36px\'': 'text-4xl',
  
  // Borders
  'border: \'1px solid #e5e7eb\'': 'border border-gray-200',
  'border: \'1px solid #d1d5db\'': 'border border-gray-300',
  'border: \'1px solid #9ca3af\'': 'border border-gray-400',
  'borderRadius: \'4px\'': 'rounded',
  'borderRadius: \'8px\'': 'rounded-lg',
  'borderRadius: \'12px\'': 'rounded-xl',
  'borderRadius: \'16px\'': 'rounded-2xl',
  'borderRadius: \'50%\'': 'rounded-full',
  
  // Width/Height
  'width: \'100%\'': 'w-full',
  'width: \'50%\'': 'w-1/2',
  'width: \'25%\'': 'w-1/4',
  'width: \'75%\'': 'w-3/4',
  'height: \'100%\'': 'h-full',
  'height: \'100vh\'': 'h-screen',
  
  // Position
  'position: \'relative\'': 'relative',
  'position: \'absolute\'': 'absolute',
  'position: \'fixed\'': 'fixed',
  'top: \'0\'': 'top-0',
  'right: \'0\'': 'right-0',
  'bottom: \'0\'': 'bottom-0',
  'left: \'0\'': 'left-0',
  
  // Overflow
  'overflow: \'hidden\'': 'overflow-hidden',
  'overflow: \'scroll\'': 'overflow-scroll',
  'overflow: \'auto\'': 'overflow-auto',
}

function shouldProcessFile(filePath) {
  const relativePath = path.relative(PROJECT_ROOT, filePath)
  
  // Check if file is in excluded directory
  if (EXCLUDE_DIRS.some(exclude => relativePath.includes(exclude))) {
    return false
  }
  
  // Check file extension
  const ext = path.extname(filePath)
  return INCLUDE_EXTENSIONS.includes(ext)
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file)) {
        getAllFiles(filePath, fileList)
      }
    } else if (shouldProcessFile(filePath)) {
      fileList.push(filePath)
    }
  })
  
  return fileList
}

function hasInlineStyles(content) {
  return /style=\{[^}]*\}/.test(content)
}

function isDynamicStyle(styleString) {
  // Check if the style contains variables, expressions, or dynamic values
  const dynamicPatterns = [
    /\$\{/,           // Template literals
    /[a-zA-Z_$][a-zA-Z0-9_$]*\./, // Object properties
    /[a-zA-Z_$][a-zA-Z0-9_$]*\[/, // Array access
    /[a-zA-Z_$][a-zA-Z0-9_$]*\(/, // Function calls
    /\+/,             // Concatenation
    /\?/,             // Ternary operators
    /&&/,             // Logical operators
    /\|\|/,           // Logical operators
  ]
  
  return dynamicPatterns.some(pattern => pattern.test(styleString))
}

function convertSimpleInlineStyles(content) {
  let newContent = content
  
  // Find all inline styles
  const styleMatches = content.matchAll(/style=\{([^}]+)\}/g)
  
  for (const match of styleMatches) {
    const styleString = match[1]
    const fullMatch = match[0]
    
    // Skip dynamic styles
    if (isDynamicStyle(styleString)) {
      continue
    }
    
    // Try to convert simple styles
    let convertedClasses = []
    let hasConversions = false
    
    // Parse the style object
    try {
      // Simple parsing for common patterns
      const stylePairs = styleString.split(',').map(pair => pair.trim())
      
      for (const pair of stylePairs) {
        const [key, value] = pair.split(':').map(s => s.trim())
        if (key && value) {
          const styleKey = `${key}: ${value}`
          if (STYLE_MAPPINGS[styleKey]) {
            convertedClasses.push(STYLE_MAPPINGS[styleKey])
            hasConversions = true
          }
        }
      }
      
      if (hasConversions) {
        // Find the className attribute on the same element
        const elementStart = content.lastIndexOf('<', match.index)
        const elementEnd = content.indexOf('>', match.index)
        const elementContent = content.substring(elementStart, elementEnd)
        
        // Extract existing className
        const classNameMatch = elementContent.match(/className=\{?['"`]([^'"`]*?)['"`]\}?/)
        let existingClasses = classNameMatch ? classNameMatch[1] : ''
        
        // Add new classes
        const newClasses = [...existingClasses.split(' '), ...convertedClasses].filter(Boolean).join(' ')
        
        // Replace the element
        let newElementContent = elementContent
        if (classNameMatch) {
          newElementContent = newElementContent.replace(classNameMatch[0], `className="${newClasses}"`)
        } else {
          newElementContent = newElementContent.replace(/^(\s*<\w+)/, `$1 className="${newClasses}"`)
        }
        
        // Remove the style attribute
        newElementContent = newElementContent.replace(/style=\{[^}]+\}/, '')
        
        newContent = newContent.replace(elementContent, newElementContent)
      }
    } catch (error) {
      // Skip if parsing fails
      continue
    }
  }
  
  return newContent
}

function addCSSCustomProperties(content) {
  // For dynamic styles, add CSS custom properties support
  let newContent = content
  
  // Find dynamic background colors
  const dynamicBgMatches = content.matchAll(/style=\{[^}]*backgroundColor:\s*([^,}]+)[^}]*\}/g)
  
  for (const match of dynamicBgMatches) {
    const bgValue = match[1]
    const fullMatch = match[0]
    
    if (isDynamicStyle(bgValue)) {
      // Replace with CSS custom property
      const newStyle = fullMatch.replace(/backgroundColor:\s*([^,}]+)/, 'backgroundColor: `var(--bg-color-${Math.random().toString(36).substr(2, 9)})`')
      newContent = newContent.replace(fullMatch, newStyle)
    }
  }
  
  return newContent
}

async function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    
    if (!hasInlineStyles(content)) {
      return { processed: false, reason: 'No inline styles found' }
    }
    
    let newContent = convertSimpleInlineStyles(content)
    newContent = addCSSCustomProperties(newContent)
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8')
      return { processed: true, changes: newContent !== content }
    }
    
    return { processed: false, reason: 'No convertible styles found' }
  } catch (error) {
    return { processed: false, error: error.message }
  }
}

async function main() {
  console.log('🔍 Finding files with inline styles...')
  
  const allFiles = getAllFiles(PROJECT_ROOT)
  const filesWithInlineStyles = []
  
  // First pass: identify files that need processing
  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      if (hasInlineStyles(content)) {
        filesWithInlineStyles.push(filePath)
      }
    } catch (error) {
      console.warn(`Warning: Could not read file ${filePath}:`, error.message)
    }
  }
  
  console.log(`📁 Found ${filesWithInlineStyles.length} files with inline styles`)
  
  if (filesWithInlineStyles.length === 0) {
    console.log('✅ No inline styles found to convert')
    return
  }
  
  // Second pass: process files
  let processedCount = 0
  let errorCount = 0
  
  for (const filePath of filesWithInlineStyles) {
    const relativePath = path.relative(PROJECT_ROOT, filePath)
    console.log(`🔄 Processing: ${relativePath}`)
    
    const result = await processFile(filePath)
    
    if (result.processed) {
      console.log(`✅ Updated: ${relativePath}`)
      processedCount++
    } else if (result.error) {
      console.error(`❌ Error processing ${relativePath}:`, result.error)
      errorCount++
    } else {
      console.log(`⏭️  Skipped: ${relativePath} - ${result.reason}`)
    }
  }
  
  console.log('\n📊 Summary:')
  console.log(`✅ Files processed: ${processedCount}`)
  console.log(`❌ Files with errors: ${errorCount}`)
  console.log(`📁 Total files checked: ${allFiles.length}`)
  console.log(`🎯 Files with inline styles: ${filesWithInlineStyles.length}`)
  
  if (processedCount > 0) {
    console.log('\n💡 Next steps:')
    console.log('1. Review the changes to ensure they look correct')
    console.log('2. Test your application to ensure styles work properly')
    console.log('3. Consider manually converting remaining dynamic styles to CSS custom properties')
    console.log('4. Add CSS custom properties to your global CSS file for dynamic values')
  }
}

// Run the script
main().catch(error => {
  console.error('Script failed:', error)
  process.exit(1)
})
