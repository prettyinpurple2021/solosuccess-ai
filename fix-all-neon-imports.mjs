#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fix neon server imports in a single file
function fixNeonServerImport(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file has the problematic import
    if (content.includes("import { createClient} from '@/lib/neon/server'")) {
      console.log(`Fixing neon import: ${filePath}`);
      
      // Replace the import
      const fixedContent = content.replace(
        "import { createClient} from '@/lib/neon/server'",
        "import { getDb } from '@/lib/database-client'"
      );
      
      // Also replace any usage of createClient with getDb
      const finalContent = fixedContent.replace(
        /const client = await createClient\(\)/g,
        'const db = getDb()'
      ).replace(
        /await createClient\(\)/g,
        'getDb()'
      );
      
      fs.writeFileSync(filePath, finalContent, 'utf8');
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
        if (fixNeonServerImport(filePath)) {
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
console.log(`\nFixed ${totalFixed} files with neon server import issues.`);
