#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// List of files to fix
const filesToFix = [
  'app/api/alerts/route.ts',
  'app/api/competitors/[id]/intelligence/route.ts',
  'app/api/intelligence/[id]/process/route.ts',
  'app/api/intelligence/[id]/route.ts',
  'app/api/intelligence/analyze/route.ts',
  'app/api/intelligence/export/route.ts',
  'app/api/intelligence/route.ts',
  'app/api/intelligence/search/route.ts',
  'app/api/notifications/processor/route.ts',
  'app/api/stripe/webhook/route.ts',
  'app/dashboard/brand/page.tsx',
  'app/dashboard/briefcase/page.tsx',
  'app/dashboard/competitors/[id]/edit/page.tsx'
];

function fixImportSyntax(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Fix multiple patterns
    let newContent = content;
    
    // Pattern 1: import type { \n import { logger
    const pattern1 = /import type \{\s*\nimport \{ logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth \} from '@\/lib\/logger'\s*\n([^}]+)\}/g;
    newContent = newContent.replace(pattern1, `import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'\nimport type {\n$1}`);
    
    // Pattern 2: import { \n import { logger
    const pattern2 = /import \{\s*\nimport \{ logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth \} from '@\/lib\/logger'\s*\n([^}]+)\}/g;
    newContent = newContent.replace(pattern2, `import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'\nimport {\n$1}`);
    
    // Pattern 3: import type { TypeName,\n import { logger
    const pattern3 = /import type \{ ([^,]+),\s*\nimport \{ logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth \} from '@\/lib\/logger'\s*\n([^}]+)\}/g;
    newContent = newContent.replace(pattern3, `import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'\nimport type { $1,\n$2}`);
    
    if (newContent !== content) {
      fs.writeFileSync(fullPath, newContent, 'utf8');
      console.log(`Fixed: ${filePath}`);
    } else {
      console.log(`No changes needed: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix all files
console.log('Fixing import syntax errors...');
filesToFix.forEach(fixImportSyntax);
console.log('Done!');
