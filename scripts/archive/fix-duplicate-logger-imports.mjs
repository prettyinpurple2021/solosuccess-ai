#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all TypeScript/TSX files
const files = await glob('**/*.{ts,tsx}', {
  ignore: ['node_modules/**', '.next/**', 'dist/**']
});

function fixDuplicateLoggerImports(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if file has both logger imports
    const hasLibLogImport = /import.*from ['"]@\/lib\/log['"]/.test(content);
    const hasLibLoggerImport = /import.*from ['"]@\/lib\/logger['"]/.test(content);
    
    if (!hasLibLogImport || !hasLibLoggerImport) {
      return;
    }
    
    let newContent = content;
    
    // Remove the duplicate logger import from @/lib/logger
    const loggerImportPattern = /import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@\/lib\/logger'\n?/g;
    newContent = newContent.replace(loggerImportPattern, '');
    
    // Update the @/lib/log import to include all needed functions
    const logImportPattern = /import { ([^}]+) } from '@\/lib\/log'/g;
    const match = newContent.match(logImportPattern);
    
    if (match) {
      // Check what functions are being used
      const usedFunctions = [];
      if (/logError\(/.test(newContent)) usedFunctions.push('error as logError');
      if (/logInfo\(/.test(newContent)) usedFunctions.push('info as logInfo');
      if (/logWarn\(/.test(newContent)) usedFunctions.push('warn as logWarn');
      if (/logDebug\(/.test(newContent)) usedFunctions.push('debug as logDebug');
      if (/logApi\(/.test(newContent)) usedFunctions.push('api as logApi');
      if (/logDb\(/.test(newContent)) usedFunctions.push('db as logDb');
      if (/logAuth\(/.test(newContent)) usedFunctions.push('auth as logAuth');
      
      if (usedFunctions.length > 0) {
        const newImport = `import { ${usedFunctions.join(', ')} } from '@/lib/log'`;
        newContent = newContent.replace(logImportPattern, newImport);
      }
    }
    
    if (newContent !== content) {
      fs.writeFileSync(fullPath, newContent, 'utf8');
      console.log(`Fixed duplicate logger imports: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

console.log('Fixing duplicate logger import conflicts...');
for (const file of files) {
  fixDuplicateLoggerImports(file);
}
console.log('Done!');
