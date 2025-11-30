#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

// File patterns to process
const FILE_PATTERNS = [
  '**/*.ts',
  '**/*.tsx', 
  '**/*.js',
  '**/*.jsx'
];

// Directories to exclude
const EXCLUDE_DIRS = [
  'node_modules/**',
  '.next/**',
  'dist/**',
  'build/**',
  'coverage/**',
  'scripts/**'
];

// Console methods to remove (but keep console.error for error handling)
const CONSOLE_METHODS_TO_REMOVE = [
  'console.log',
  'console.debug',
  'console.info',
  'console.warn'
];

// Keep these console methods (important for debugging)
const CONSOLE_METHODS_TO_KEEP = [
  'console.error'
];

let totalFilesProcessed = 0;
let totalLogsRemoved = 0;
let filesWithLogs = 0;

function shouldProcessFile(filePath) {
  // Skip if in excluded directory
  for (const excludeDir of EXCLUDE_DIRS) {
    if (filePath.includes(excludeDir.replace('**', ''))) {
      return false;
    }
  }
  
  // Skip test files for now (they might need console logs)
  if (filePath.includes('.test.') || filePath.includes('.spec.')) {
    return false;
  }
  
  return true;
}

function removeConsoleLogs(content, filePath) {
  let modifiedContent = content;
  let logsRemoved = 0;
  
  // Remove console.log statements (various patterns)
  const patterns = [
    // console.log('message');
    /^\s*console\.(log|debug|info|warn)\s*\([^;]*\)\s*;?\s*$/gm,
    
    // console.log('message', variable);
    /^\s*console\.(log|debug|info|warn)\s*\([^)]*\)\s*;?\s*$/gm,
    
    // Multi-line console.log
    /^\s*console\.(log|debug|info|warn)\s*\([\s\S]*?\)\s*;?\s*$/gm,
    
    // console.log with template literals
    /^\s*console\.(log|debug|info|warn)\s*\([^`]*`[^`]*`[^)]*\)\s*;?\s*$/gm
  ];
  
  patterns.forEach(pattern => {
    const matches = modifiedContent.match(pattern);
    if (matches) {
      logsRemoved += matches.length;
      modifiedContent = modifiedContent.replace(pattern, '');
    }
  });
  
  // Remove empty lines that might be left behind
  modifiedContent = modifiedContent.replace(/^\s*\n\s*\n/gm, '\n');
  
  if (logsRemoved > 0) {
    filesWithLogs++;
    if (VERBOSE) {
      console.log(`  Removed ${logsRemoved} console statements from ${filePath}`);
    }
  }
  
  totalLogsRemoved += logsRemoved;
  return { content: modifiedContent, logsRemoved };
}

function processFile(filePath) {
  if (!shouldProcessFile(filePath)) {
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if no console logs
    const hasConsoleLogs = CONSOLE_METHODS_TO_REMOVE.some(method => 
      content.includes(method)
    );
    
    if (!hasConsoleLogs) {
      return;
    }
    
    totalFilesProcessed++;
    
    if (DRY_RUN) {
      console.log(`[DRY RUN] Would process: ${filePath}`);
      return;
    }
    
    const { content: modifiedContent, logsRemoved } = removeConsoleLogs(content, filePath);
    
    if (logsRemoved > 0) {
      fs.writeFileSync(filePath, modifiedContent, 'utf8');
      if (VERBOSE) {
        console.log(`✅ Processed ${filePath} - removed ${logsRemoved} console logs`);
      }
    }
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function main() {
  console.log('🧹 Console Log Cleanup Tool');
  console.log('============================');
  
  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No files will be modified');
  }
  
  console.log('📁 Scanning for files...');
  
  // Find all matching files
  let allFiles = [];
  FILE_PATTERNS.forEach(pattern => {
    const files = glob.sync(pattern, { 
      ignore: EXCLUDE_DIRS,
      cwd: process.cwd()
    });
    allFiles = allFiles.concat(files);
  });
  
  // Remove duplicates
  allFiles = [...new Set(allFiles)];
  
  console.log(`📊 Found ${allFiles.length} files to scan`);
  
  // Process each file
  allFiles.forEach(processFile);
  
  // Summary
  console.log('\n📈 Summary:');
  console.log(`   Files scanned: ${allFiles.length}`);
  console.log(`   Files processed: ${totalFilesProcessed}`);
  console.log(`   Files with console logs: ${filesWithLogs}`);
  console.log(`   Total console logs removed: ${totalLogsRemoved}`);
  
  if (DRY_RUN) {
    console.log('\n💡 To actually remove console logs, run without --dry-run');
  } else {
    console.log('\n✅ Console log cleanup complete!');
  }
}

// Run the script
main();
