#!/usr/bin/env node

import { renameSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// File and directory renaming mappings
const renameMappings = {
  // Directory renames
  'soloboss documents': 'solosuccess documents',
  
  // File renames (if any specific files need renaming)
  // Add specific file renames here as needed
};

console.log('🚀 Starting file and directory renaming...');
console.log('📋 Renaming mappings:');
Object.entries(renameMappings).forEach(([from, to]) => {
  console.log(`   "${from}" → "${to}"`);
});
console.log('');

let totalRenamed = 0;

// Function to rename files and directories recursively
function renameInDirectory(dirPath) {
  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Check if directory name needs renaming
        if (renameMappings[entry.name]) {
          const newName = renameMappings[entry.name];
          const newPath = join(dirPath, newName);
          
          if (!existsSync(newPath)) {
            try {
              renameSync(fullPath, newPath);
              console.log(`✅ Renamed directory: ${entry.name} → ${newName}`);
              totalRenamed++;
              
              // Continue processing in the renamed directory
              renameInDirectory(newPath);
            } catch (error) {
              console.log(`❌ Error renaming directory ${entry.name}: ${error.message}`);
            }
          } else {
            console.log(`⚠️  Directory ${newName} already exists, skipping ${entry.name}`);
          }
        } else {
          // Recursively process subdirectories
          renameInDirectory(fullPath);
        }
      } else if (entry.isFile()) {
        // Check if file name needs renaming
        const fileName = basename(entry.name, extname(entry.name));
        const extension = extname(entry.name);
        
        if (renameMappings[fileName]) {
          const newName = renameMappings[fileName] + extension;
          const newPath = join(dirPath, newName);
          
          if (!existsSync(newPath)) {
            try {
              renameSync(fullPath, newPath);
              console.log(`✅ Renamed file: ${entry.name} → ${newName}`);
              totalRenamed++;
            } catch (error) {
              console.log(`❌ Error renaming file ${entry.name}: ${error.message}`);
            }
          } else {
            console.log(`⚠️  File ${newName} already exists, skipping ${entry.name}`);
          }
        }
      }
    }
  } catch (error) {
    console.log(`❌ Error processing directory ${dirPath}: ${error.message}`);
  }
}

// Start renaming process
console.log('📁 Starting file and directory renaming...');
renameInDirectory(projectRoot);

// Summary
console.log('');
console.log('📊 RENAMING SUMMARY:');
console.log(`   Total items renamed: ${totalRenamed}`);
console.log('');
console.log('✅ File and directory renaming completed!');
console.log('');
console.log('🔍 Note: This script only handles specific file/directory renames.');
console.log('   Most content changes are handled by the rebrand-automation.mjs script.');
