#!/usr/bin/env node

/**
 * Script to replace console.log statements with proper logging
 * This script will:
 * 1. Find all console.log statements in the codebase
 * 2. Replace them with appropriate logger methods
 * 3. Add proper imports where needed
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const PROJECT_ROOT = path.resolve(__dirname, '..')
const EXCLUDE_DIRS = ['node_modules', '.next', '.git', 'dist', 'build']
const EXCLUDE_FILES = ['.env', '.env.local', '.env.example']
const INCLUDE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']

// Logger import patterns
const LOGGER_IMPORT = "import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'"

// Replacement patterns
const CONSOLE_REPLACEMENTS = [
  // Error logs
  {
    pattern: /console\.error\((['"`])(.*?)\1(?:,\s*(.*?))?\)/g,
    replacement: (match, quote, message, context) => {
      if (context) {
        return `logError(${quote}${message}${quote}, ${context})`
      }
      return `logError(${quote}${message}${quote})`
    }
  },
  // Warning logs
  {
    pattern: /console\.warn\((['"`])(.*?)\1(?:,\s*(.*?))?\)/g,
    replacement: (match, quote, message, context) => {
      if (context) {
        return `logWarn(${quote}${message}${quote}, ${context})`
      }
      return `logWarn(${quote}${message}${quote})`
    }
  },
  // Info logs (most console.log statements)
  {
    pattern: /console\.log\((['"`])(.*?)\1(?:,\s*(.*?))?\)/g,
    replacement: (match, quote, message, context) => {
      // Check if it's an error message
      if (message.toLowerCase().includes('error') || message.toLowerCase().includes('failed')) {
        if (context) {
          return `logError(${quote}${message}${quote}, ${context})`
        }
        return `logError(${quote}${message}${quote})`
      }
      // Check if it's a warning message
      if (message.toLowerCase().includes('warn') || message.toLowerCase().includes('deprecated')) {
        if (context) {
          return `logWarn(${quote}${message}${quote}, ${context})`
        }
        return `logWarn(${quote}${message}${quote})`
      }
      // Default to info
      if (context) {
        return `logInfo(${quote}${message}${quote}, ${context})`
      }
      return `logInfo(${quote}${message}${quote})`
    }
  },
  // Debug logs
  {
    pattern: /console\.debug\((['"`])(.*?)\1(?:,\s*(.*?))?\)/g,
    replacement: (match, quote, message, context) => {
      if (context) {
        return `logDebug(${quote}${message}${quote}, ${context})`
      }
      return `logDebug(${quote}${message}${quote})`
    }
  },
  // Generic console.log with variables
  {
    pattern: /console\.log\(([^'"`][^)]*)\)/g,
    replacement: (match, content) => {
      return `logInfo(\`${content.replace(/`/g, '\\`')}\`)`
    }
  }
]

// Special patterns for specific contexts
const CONTEXT_REPLACEMENTS = [
  // API route logging
  {
    pattern: /console\.log\(['"`]Error in.*API.*['"`],\s*(.*?)\)/g,
    replacement: 'logError("API error", { error: $1 })'
  },
  // Database operation logging
  {
    pattern: /console\.log\(['"`]Database.*['"`],\s*(.*?)\)/g,
    replacement: 'logDb("operation", "table", undefined, { details: $1 })'
  },
  // Authentication logging
  {
    pattern: /console\.log\(['"`]Auth.*['"`],\s*(.*?)\)/g,
    replacement: 'logAuth("action", undefined, true, { details: $1 })'
  }
]

function shouldProcessFile(filePath) {
  const relativePath = path.relative(PROJECT_ROOT, filePath)
  
  // Check if file should be excluded
  if (EXCLUDE_FILES.some(exclude => relativePath.includes(exclude))) {
    return false
  }
  
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

function hasConsoleStatements(content) {
  return /console\.(log|error|warn|debug|info)\(/.test(content)
}

function hasLoggerImport(content) {
  return /from ['"]@\/lib\/logger['"]/.test(content)
}

function replaceConsoleStatements(content) {
  let newContent = content
  
  // Apply context-specific replacements first
  CONTEXT_REPLACEMENTS.forEach(({ pattern, replacement }) => {
    newContent = newContent.replace(pattern, replacement)
  })
  
  // Apply general replacements
  CONSOLE_REPLACEMENTS.forEach(({ pattern, replacement }) => {
    newContent = newContent.replace(pattern, replacement)
  })
  
  return newContent
}

function addLoggerImport(content) {
  // Find the last import statement
  const importLines = content.split('\n').filter(line => 
    line.trim().startsWith('import ') || line.trim().startsWith('const ') && line.includes('require')
  )
  
  if (importLines.length === 0) {
    // Add at the beginning
    return LOGGER_IMPORT + '\n' + content
  }
  
  const lastImportLine = importLines[importLines.length - 1]
  const lastImportIndex = content.lastIndexOf(lastImportLine)
  const insertIndex = content.indexOf('\n', lastImportIndex) + 1
  
  return content.slice(0, insertIndex) + LOGGER_IMPORT + '\n' + content.slice(insertIndex)
}

async function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    
    if (!hasConsoleStatements(content)) {
      return { processed: false, reason: 'No console statements found' }
    }
    
    let newContent = replaceConsoleStatements(content)
    
    if (!hasLoggerImport(newContent)) {
      newContent = addLoggerImport(newContent)
    }
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8')
      return { processed: true, changes: newContent !== content }
    }
    
    return { processed: false, reason: 'No changes needed' }
  } catch (error) {
    return { processed: false, error: error.message }
  }
}

async function main() {
  console.log('🔍 Finding files with console statements...')
  
  const allFiles = getAllFiles(PROJECT_ROOT)
  const filesWithConsole = []
  
  // First pass: identify files that need processing
  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      if (hasConsoleStatements(content)) {
        filesWithConsole.push(filePath)
      }
    } catch (error) {
      console.warn(`Warning: Could not read file ${filePath}:`, error.message)
    }
  }
  
  console.log(`📁 Found ${filesWithConsole.length} files with console statements`)
  
  if (filesWithConsole.length === 0) {
    console.log('✅ No console statements found to replace')
    return
  }
  
  // Second pass: process files
  let processedCount = 0
  let errorCount = 0
  
  for (const filePath of filesWithConsole) {
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
  console.log(`🎯 Files with console statements: ${filesWithConsole.length}`)
  
  if (processedCount > 0) {
    console.log('\n💡 Next steps:')
    console.log('1. Review the changes to ensure they look correct')
    console.log('2. Run your linter to check for any issues')
    console.log('3. Test your application to ensure logging works properly')
    console.log('4. Consider removing any remaining console statements manually')
  }
}

// Run the script
main().catch(error => {
  console.error('Script failed:', error)
  process.exit(1)
})
