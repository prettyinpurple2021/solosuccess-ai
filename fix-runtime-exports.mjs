#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fix a single file
function fixRuntimeExport(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file has the problematic pattern
    const problematicPattern = /import type \{\s*\n\s*\/\/ Edge runtime enabled after refactoring to jose and Neon HTTP\s*\nexport const runtime = 'edge'\s*\n/g;
    
    if (problematicPattern.test(content)) {
      console.log(`Fixing: ${filePath}`);
      
      // Replace the problematic pattern with the correct one
      const fixedContent = content.replace(
        /import type \{\s*\n\s*\/\/ Edge runtime enabled after refactoring to jose and Neon HTTP\s*\nexport const runtime = 'edge'\s*\n/g,
        `// Edge runtime enabled after refactoring to jose and Neon HTTP\nexport const runtime = 'edge'\n\nimport type {\n`
      );
      
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      return true;
    }
    
    // Also check for the pattern without the comment
    const simplePattern = /import type \{\s*\n\s*export const runtime = 'edge'\s*\n/g;
    
    if (simplePattern.test(content)) {
      console.log(`Fixing (simple): ${filePath}`);
      
      const fixedContent = content.replace(
        /import type \{\s*\n\s*export const runtime = 'edge'\s*\n/g,
        `export const runtime = 'edge'\n\nimport type {\n`
      );
      
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively find and fix files
function findAndFixFiles(dir) {
  let fixedCount = 0;
  
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        fixedCount += findAndFixFiles(filePath);
      } else if (file.endsWith('.ts') && file.includes('route')) {
        if (fixRuntimeExport(filePath)) {
          fixedCount++;
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return fixedCount;
}

// Main execution
const apiDir = path.join(__dirname, 'app', 'api');
console.log(`Scanning API directory: ${apiDir}`);

const totalFixed = findAndFixFiles(apiDir);
console.log(`\nFixed ${totalFixed} files with runtime export issues.`);
