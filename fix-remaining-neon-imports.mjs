#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fix neon client imports in a single file
function fixNeonClientImport(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file has the problematic import
    if (content.includes("import { query } from '@/lib/neon/client'")) {
      console.log(`Fixing neon client import: ${filePath}`);
      
      // Replace the import
      const fixedContent = content.replace(
        "import { query } from '@/lib/neon/client'",
        "import { getSql } from '@/lib/api-utils'"
      );
      
      // Also replace any usage of query with getSql
      const finalContent = fixedContent.replace(
        /const result = await query\(/g,
        "const result = await getSql().query("
      );
      
      fs.writeFileSync(filePath, finalContent, 'utf8');
      return true;
    }
    
    // Check for createClient imports from neon/server
    if (content.includes("import { createClient } from '@/lib/neon/server'")) {
      console.log(`Fixing neon server import: ${filePath}`);
      
      // Replace the import
      const fixedContent = content.replace(
        "import { createClient } from '@/lib/neon/server'",
        "import { getDb } from '@/lib/database-client'"
      );
      
      // Also replace any usage of createClient with getDb
      const finalContent = fixedContent.replace(
        /const client = await createClient\(\)/g,
        "const db = getDb()"
      );
      
      fs.writeFileSync(filePath, finalContent, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing file ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively find and fix files
function findAndFixFiles(dir) {
  let fixedCount = 0;
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        fixedCount += findAndFixFiles(fullPath);
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        if (fixNeonClientImport(fullPath)) {
          fixedCount++;
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return fixedCount;
}

// Start fixing from the app/api directory
console.log('Starting to fix neon imports...');
const fixedCount = findAndFixFiles(path.join(__dirname, 'app', 'api'));

console.log(`Fixed ${fixedCount} files with neon import issues.`);
