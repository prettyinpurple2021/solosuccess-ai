#!/usr/bin/env node
/**
 * Script to refactor jwt.verify() to jose.jwtVerify()
 * Handles all JWT verification patterns in API routes
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

function refactorJwtToJose(filePath) {
  let content = readFileSync(filePath, 'utf-8')
  let modified = false

  // Skip if already using jose or no JWT usage
  if (!content.includes('jwt.verify') && !content.includes('jwt.decode')) {
    return false
  }

  // Pattern 1: Simple jwt.verify with process.env.JWT_SECRET
  const verifyPattern1 = /const\s+(\w+)\s*=\s*jwt\.verify\((\w+),\s*process\.env\.JWT_SECRET[^)]*\)\s*as\s*any/g
  if (verifyPattern1.test(content)) {
    content = content.replace(verifyPattern1, (match, decodedVar, tokenVar) => {
      return `const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload: ${decodedVar} } = await jose.jwtVerify(${tokenVar}, secret)`
    })
    modified = true
  }

  // Pattern 2: jwt.verify with fallback secret
  const verifyPattern2 = /const\s+(\w+)\s*=\s*jwt\.verify\((\w+),\s*process\.env\.JWT_SECRET\s*\|\|\s*['"][^'"]*['"]\)\s*as\s*any/g
  if (verifyPattern2.test(content)) {
    content = content.replace(verifyPattern2, (match, decodedVar, tokenVar) => {
      return `if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured')
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload: ${decodedVar} } = await jose.jwtVerify(${tokenVar}, secret)`
    })
    modified = true
  }

  // Pattern 3: Replace decoded.userId or decoded.user_id access patterns
  // This is handled contextually - we'll log files that need manual review
  
  if (modified) {
    writeFileSync(filePath, content, 'utf-8')
    return true
  }
  
  // Check if file has jwt usage but wasn't auto-fixed
  if (content.includes('jwt.verify') || content.includes('jwt.decode')) {
    console.warn(`⚠️  File has JWT usage that needs manual review: ${filePath}`)
  }
  
  return false
}

function main() {
  console.log('🔍 Scanning API routes for JWT usage...\n')
  const files = getAllFiles(appApiDir)
  
  let updatedCount = 0
  let errorCount = 0

  for (const file of files) {
    try {
      if (refactorJwtToJose(file)) {
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

