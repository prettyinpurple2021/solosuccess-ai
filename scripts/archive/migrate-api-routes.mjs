#!/usr/bin/env node

/**
 * Migration script to replace old API routes with standardized versions
 * This script helps identify and replace routes that need to be updated
 */

import { readdir, readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// Routes that need to be migrated
const routesToMigrate = [
  'app/api/auth/user/route.ts',
  'app/api/dashboard/route.ts',
  'app/api/auth/signin/route.ts',
  'app/api/briefcase/route.ts',
  'app/api/tasks/route.ts',
  'app/api/goals/route.ts',
  'app/api/competitors/route.ts',
  'app/api/intelligence/route.ts'
]

// Patterns to replace
const replacements = [
  {
    // Replace raw SQL imports with Drizzle
    pattern: /import { neon } from '@neondatabase\/serverless'/g,
    replacement: "import { getDb } from '@/lib/database-client'"
  },
  {
    // Replace getSql function
    pattern: /function getSql\(\)\s*{\s*const url = process\.env\.DATABASE_URL\s*if \(!url\)\s*{\s*throw new Error\('DATABASE_URL is not set'\)\s*}\s*return neon\(url\)\s*}/g,
    replacement: ''
  },
  {
    // Replace raw SQL queries with Drizzle
    pattern: /const sql = getSql\(\)/g,
    replacement: 'const db = getDb()'
  },
  {
    // Replace custom auth functions
    pattern: /async function authenticateJWTRequest\(request: NextRequest\)\s*{[\s\S]*?}/g,
    replacement: ''
  },
  {
    // Replace NextResponse.json with createSuccessResponse
    pattern: /NextResponse\.json\(\{ success: true, data: ([^}]+) \}, \{ status: (\d+) \}\)/g,
    replacement: 'createSuccessResponse($1, undefined, $2)'
  },
  {
    // Replace error responses
    pattern: /NextResponse\.json\(\{ error: ([^}]+) \}, \{ status: (\d+) \}\)/g,
    replacement: 'createErrorResponse($1, $2)'
  }
]

async function migrateRoute(routePath) {
  try {
    const fullPath = join(projectRoot, routePath)
    const content = await readFile(fullPath, 'utf-8')
    
    let updatedContent = content
    
    // Apply replacements
    for (const { pattern, replacement } of replacements) {
      updatedContent = updatedContent.replace(pattern, replacement)
    }
    
    // Add necessary imports
    if (updatedContent.includes('createSuccessResponse') && !updatedContent.includes('@/lib/api-response')) {
      updatedContent = updatedContent.replace(
        /import.*from.*next\/server/g,
        (match) => `${match}\nimport { createSuccessResponse, createErrorResponse, withAuth, handleApiError } from '@/lib/api-response'`
      )
    }
    
    if (updatedContent.includes('getDb()') && !updatedContent.includes('@/lib/database-client')) {
      updatedContent = updatedContent.replace(
        /import.*from.*next\/server/g,
        (match) => `${match}\nimport { getDb } from '@/lib/database-client'`
      )
    }
    
    // Write the updated content to a backup file first
    const backupPath = fullPath + '.backup'
    await writeFile(backupPath, content)
    
    // Write the updated content
    await writeFile(fullPath, updatedContent)
    
    console.log(`✅ Migrated: ${routePath}`)
    console.log(`📁 Backup created: ${backupPath}`)
    
  } catch (error) {
    console.error(`❌ Failed to migrate ${routePath}:`, error.message)
  }
}

async function main() {
  console.log('🚀 Starting API route migration...')
  console.log(`📁 Project root: ${projectRoot}`)
  
  for (const route of routesToMigrate) {
    await migrateRoute(route)
  }
  
  console.log('✅ Migration completed!')
  console.log('\n📋 Next steps:')
  console.log('1. Review the migrated routes for any remaining issues')
  console.log('2. Test the API endpoints')
  console.log('3. Remove .backup files once satisfied with the migration')
  console.log('4. Update frontend components to use the new response format')
}

main().catch(console.error)


