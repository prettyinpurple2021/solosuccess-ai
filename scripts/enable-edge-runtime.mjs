#!/usr/bin/env node
/**
 * Script to enable Edge runtime in API routes
 * Replaces disabled edge runtime comments with proper edge runtime export
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const appApiDir = 'app/api'

function getAllFiles(dir, fileList = []) {
  const files = readdirSync(dir)
  files.forEach(file => {
    const filePath = join(dir, file)
    if (statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList)
    } else if (file.endsWith('.ts')) {
      fileList.push(filePath)
    }
  })
  return fileList
}

function enableEdgeRuntime(filePath) {
  let content = readFileSync(filePath, 'utf-8')
  let modified = false

  // Pattern 1: Replace disabled edge runtime comments
  const disabledPatterns = [
    /\/\/ Removed Edge Runtime due to Node\.js dependencies[^\n]*\n/g,
    /\/\/ Edge Runtime disabled due to Node\.js dependency incompatibility\n/g,
    /\/\/ \/\/ Removed Edge Runtime[^\n]*\n/g,
  ]

  for (const pattern of disabledPatterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, '')
      modified = true
    }
  }

  // Pattern 2: If no runtime export exists and comments were removed, add edge runtime
  if (modified && !content.includes('export const runtime')) {
    // Find where to insert (after imports, before first export function)
    const importEnd = content.lastIndexOf('import ')
    if (importEnd >= 0) {
      const nextLineAfterImports = content.indexOf('\n', importEnd)
      if (nextLineAfterImports >= 0) {
        const insertPos = nextLineAfterImports + 1
        // Check if there's already dynamic export
        const beforeInsert = content.slice(0, insertPos)
        const afterInsert = content.slice(insertPos)
        
        // Only add if not already present
        if (!beforeInsert.includes('export const runtime') && !afterInsert.match(/^export const runtime/m)) {
          content = beforeInsert + '\n// Edge runtime enabled after refactoring to jose and Neon HTTP\nexport const runtime = \'edge\'\n' + afterInsert
          modified = true
        }
      }
    }
  }

  // Pattern 3: Replace jwt imports with jose
  if (content.includes("import jwt from 'jsonwebtoken'")) {
    content = content.replace("import jwt from 'jsonwebtoken'", "import * as jose from 'jose'")
    modified = true
  }

  if (content.includes('import { Pool } from \'pg\'') || content.includes('import { Pool, PoolClient } from \'pg\'')) {
    console.warn(`⚠️  File still imports pg Pool: ${filePath}`)
  }

  if (modified) {
    writeFileSync(filePath, content, 'utf-8')
    return true
  }
  return false
}

function main() {
  console.log('🔍 Scanning API routes...\n')
  const files = getAllFiles(appApiDir)
  
  let updatedCount = 0
  let errorCount = 0

  for (const file of files) {
    try {
      if (enableEdgeRuntime(file)) {
        console.log(`✅ Updated: ${file}`)
        updatedCount++
      }
    } catch (err) {
      console.error(`❌ Error processing ${file}:`, err.message)
      errorCount++
    }
  }

  console.log(`\n✨ Done! Updated ${updatedCount} files`)
  if (errorCount > 0) {
    console.log(`⚠️  ${errorCount} files had errors`)
  }
}

main()

