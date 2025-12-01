#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all TypeScript/TSX files
const files = await glob('**/*.{ts,tsx}', {
  ignore: ['node_modules/**', '.next/**', 'dist/**']
});

function fixFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let newContent = content;
    let hasChanges = false;
    
    // Fix import syntax errors
    const patterns = [
      // Pattern 1: import { \n import { logger
      {
        regex: /import \{\s*\nimport \{ logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth \} from '@\/lib\/logger'\s*\n([^}]+)\}/g,
        replacement: `import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'\nimport {\n$1}`
      },
      // Pattern 2: import type { \n import { logger
      {
        regex: /import type \{\s*\nimport \{ logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth \} from '@\/lib\/logger'\s*\n([^}]+)\}/g,
        replacement: `import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'\nimport type {\n$1}`
      },
      // Pattern 3: import type { TypeName,\n import { logger
      {
        regex: /import type \{ ([^,]+),\s*\nimport \{ logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth \} from '@\/lib\/logger'\s*\n([^}]+)\}/g,
        replacement: `import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'\nimport type { $1,\n$2}`
      }
    ];
    
    patterns.forEach(pattern => {
      const result = newContent.replace(pattern.regex, pattern.replacement);
      if (result !== newContent) {
        newContent = result;
        hasChanges = true;
      }
    });
    
    // Fix JSX syntax errors - remove extra }> 
    const jsxPattern = /className="[^"]*"\s*\}>/g;
    const jsxResult = newContent.replace(jsxPattern, (match) => match.replace(/\s*\}\>$/, '>'));
    if (jsxResult !== newContent) {
      newContent = jsxResult;
      hasChanges = true;
    }
    
    // Fix misplaced import statements in the middle of code
    const misplacedImportPattern = /^import \{ logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth \} from '@\/lib\/logger'$/gm;
    const importResult = newContent.replace(misplacedImportPattern, '');
    if (importResult !== newContent) {
      newContent = importResult;
      hasChanges = true;
    }
    
    if (hasChanges) {
      fs.writeFileSync(fullPath, newContent, 'utf8');
      console.log(`Fixed: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

console.log('Fixing all syntax errors...');
for (const file of files) {
  fixFile(file);
}
console.log('Done!');
