#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Rebranding mappings
const rebrandMappings = {
  // Primary brand name changes
  'SoloBoss AI': 'SoloSuccess AI',
  'SoloBoss': 'SoloSuccess',
  'soloboss-ai': 'solosuccess-ai',
  'soloboss_ai': 'solosuccess_ai',
  'soloboss': 'solosuccess',
  'solo-boss': 'solo-success',
  'solo_boss': 'solo_success',
  
  // Domain and URL changes
  'soloboss.ai': 'solosuccess.ai',
  'soloboss.com': 'solosuccess.com',
  
  // File and directory name patterns
  'v0-solo-boss-ai-platform': 'v0-solo-success-ai-platform',
  'solo-boss-ai-platform': 'solo-success-ai-platform',
  
  // Tagline and description updates
  'SoloBoss AI Platform': 'SoloSuccess AI Platform',
  'SoloBoss AI - Your AI-Powered Business Assistant': 'SoloSuccess AI - Your AI-Powered Business Assistant',
  
  // Email and contact updates
  'hello@soloboss.ai': 'hello@solosuccess.ai',
  'support@soloboss.ai': 'support@solosuccess.ai',
  'contact@soloboss.ai': 'contact@solosuccess.ai'
};

// File extensions to process
const processableExtensions = [
  '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt', '.css', '.scss', 
  '.html', '.xml', '.yml', '.yaml', '.env', '.config', '.mjs', '.sql'
];

// Directories to skip
const skipDirectories = [
  'node_modules', '.git', '.next', 'dist', 'build', 'coverage', 
  '.vercel', '.cache', 'tmp', 'temp', 'logs', 'backup-soloboss-*',
  'SoloBoss-Backups'
];

// Files to skip
const skipFiles = [
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
  'BACKUP_MANIFEST.json', 'rebrand-automation.mjs'
];

console.log('🚀 Starting SoloBoss → SoloSuccess rebranding automation...');
console.log('📋 Processing files with the following mappings:');
Object.entries(rebrandMappings).forEach(([from, to]) => {
  console.log(`   "${from}" → "${to}"`);
});
console.log('');

let totalFilesProcessed = 0;
let totalReplacements = 0;
let filesWithChanges = 0;

// Function to check if directory should be skipped
function shouldSkipDirectory(dirName) {
  return skipDirectories.some(skipDir => {
    if (skipDir.includes('*')) {
      return dirName.startsWith(skipDir.replace('*', ''));
    }
    return dirName === skipDir;
  });
}

// Function to check if file should be skipped
function shouldSkipFile(fileName) {
  return skipFiles.includes(fileName) || 
         fileName.startsWith('.') && fileName.includes('cache');
}

// Function to process a single file
function processFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    let newContent = content;
    let fileReplacements = 0;
    
    // Apply all rebranding mappings
    for (const [from, to] of Object.entries(rebrandMappings)) {
      const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = newContent.match(regex);
      if (matches) {
        newContent = newContent.replace(regex, to);
        fileReplacements += matches.length;
      }
    }
    
    // Write back if changes were made
    if (fileReplacements > 0) {
      writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ ${filePath} - ${fileReplacements} replacements`);
      filesWithChanges++;
      totalReplacements += fileReplacements;
    }
    
    totalFilesProcessed++;
  } catch (error) {
    console.log(`❌ Error processing ${filePath}: ${error.message}`);
  }
}

// Function to recursively process directory
function processDirectory(dirPath) {
  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        if (!shouldSkipDirectory(entry.name)) {
          processDirectory(fullPath);
        } else {
          console.log(`⏭️  Skipping directory: ${entry.name}`);
        }
      } else if (entry.isFile()) {
        const ext = extname(entry.name);
        if (processableExtensions.includes(ext) && !shouldSkipFile(entry.name)) {
          processFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.log(`❌ Error processing directory ${dirPath}: ${error.message}`);
  }
}

// Start processing
console.log('📁 Starting file processing...');
processDirectory(projectRoot);

// Summary
console.log('');
console.log('📊 REBRANDING SUMMARY:');
console.log(`   Files processed: ${totalFilesProcessed}`);
console.log(`   Files with changes: ${filesWithChanges}`);
console.log(`   Total replacements: ${totalReplacements}`);
console.log('');
console.log('✅ Rebranding automation completed!');
console.log('');
console.log('🔍 Next steps:');
console.log('   1. Review the changes made');
console.log('   2. Test the application');
console.log('   3. Update any remaining manual references');
console.log('   4. Update external services and configurations');
