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
let allConsoleStatements = [];

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

function findConsoleStatements(content, filePath) {
  const statements = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // Check for console statements (more flexible regex)
    CONSOLE_METHODS_TO_REMOVE.forEach(method => {
      const regex = new RegExp(`\\b${method.replace('.', '\\.')}\\s*\\(`, 'g');
      const matches = line.match(regex);
      
      if (matches) {
        statements.push({
          method,
          line: line.trim(),
          lineNumber,
          file: filePath
        });
      }
    });
  });
  
  return statements;
}

function removeConsoleLogs(content, filePath) {
  let modifiedContent = content;
  let logsRemoved = 0;
  
  // Find all console statements first
  const statements = findConsoleStatements(content, filePath);
  
  if (statements.length === 0) {
    return { content: modifiedContent, logsRemoved: 0 };
  }
  
  // Remove console statements line by line
  const lines = modifiedContent.split('\n');
  const newLines = [];
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    let shouldRemoveLine = false;
    
    // Check if this line contains a console statement to remove
    CONSOLE_METHODS_TO_REMOVE.forEach(method => {
      const regex = new RegExp(`^\\s*${method.replace('.', '\\.')}\\s*\\([^)]*\\)\\s*;?\\s*$`);
      if (regex.test(line.trim())) {
        shouldRemoveLine = true;
        logsRemoved++;
      }
    });
    
    if (!shouldRemoveLine) {
      newLines.push(line);
    }
  });
  
  modifiedContent = newLines.join('\n');
  
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
    
    // Find all console statements for reporting
    const statements = findConsoleStatements(content, filePath);
    if (statements.length > 0) {
      allConsoleStatements = allConsoleStatements.concat(statements);
    }
    
    // Skip if no console logs to remove
    const hasConsoleLogs = CONSOLE_METHODS_TO_REMOVE.some(method => 
      content.includes(method)
    );
    
    if (!hasConsoleLogs) {
      return;
    }
    
    totalFilesProcessed++;
    
    if (DRY_RUN) {
      console.log(`[DRY RUN] Would process: ${filePath}`);
      statements.forEach(stmt => {
        console.log(`  - Line ${stmt.lineNumber}: ${stmt.line}`);
      });
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
  console.log('🧹 Improved Console Log Detection Tool');
  console.log('=====================================');
  
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
  console.log(`   Total console statements found: ${allConsoleStatements.length}`);
  console.log(`   Total console logs removed: ${totalLogsRemoved}`);
  
  if (allConsoleStatements.length > 0) {
    console.log('\n🔍 Console Statements Found:');
    allConsoleStatements.forEach(stmt => {
      console.log(`   ${stmt.file}:${stmt.lineNumber} - ${stmt.method} - ${stmt.line}`);
    });
  }
  
  if (DRY_RUN) {
    console.log('\n💡 To actually remove console logs, run without --dry-run');
  } else {
    console.log('\n✅ Console log cleanup complete!');
  }
}

// Run the script
main();
