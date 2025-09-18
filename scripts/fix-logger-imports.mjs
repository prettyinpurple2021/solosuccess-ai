#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all TypeScript/TSX files
const files = await glob('**/*.{ts,tsx}', {
  ignore: ['node_modules/**', '.next/**', 'dist/**']
});

function fixLoggerImports(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if file uses logger functions
    const usesLogger = /(logInfo|logError|logWarn|logDebug|logApi|logDb|logAuth)\(/.test(content);
    
    if (!usesLogger) {
      return;
    }
    
    // Check if logger import already exists
    const hasLoggerImport = /import.*logger.*from ['"]@\/lib\/logger['"]/.test(content);
    
    if (hasLoggerImport) {
      return;
    }
    
    let newContent = content;
    
    // Find the best place to add the import
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Skip initial comments and 'use client' directive
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('// @ts-nocheck') || 
          lines[i].startsWith('"use client"') || 
          lines[i].trim() === '') {
        insertIndex = i + 1;
      } else if (lines[i].startsWith('import ')) {
        insertIndex = i;
        break;
      }
    }
    
    // Add the logger import
    lines.splice(insertIndex, 0, "import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'");
    newContent = lines.join('\n');
    
    fs.writeFileSync(fullPath, newContent, 'utf8');
    console.log(`Added logger import: ${filePath}`);
    
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

console.log('Adding logger imports to files that use logger functions...');
for (const file of files) {
  fixLoggerImports(file);
}
console.log('Done!');
