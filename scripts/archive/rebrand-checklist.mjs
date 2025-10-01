#!/usr/bin/env node

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🔍 SoloBoss → SoloSuccess Rebranding Checklist');
console.log('==============================================');
console.log('');

// Function to check if file contains old branding
function checkFileForOldBranding(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const oldBrandingPatterns = [
      'SoloBoss AI', 'SoloBoss', 'soloboss-ai', 'soloboss_ai', 
      'soloboss', 'solo-boss', 'solo_boss', 'soloboss.ai'
    ];
    
    const foundPatterns = [];
    oldBrandingPatterns.forEach(pattern => {
      const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      if (regex.test(content)) {
        foundPatterns.push(pattern);
      }
    });
    
    return foundPatterns;
  } catch (error) {
    return ['ERROR: Could not read file'];
  }
}

// Function to scan directory for old branding
function scanDirectory(dirPath, relativePath = '') {
  const results = {
    filesWithOldBranding: [],
    totalFiles: 0,
    directories: []
  };
  
  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      const relativeFilePath = join(relativePath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip certain directories
        if (!['node_modules', '.git', '.next', 'dist', 'build', 'coverage', '.cache'].includes(entry.name)) {
          const subResults = scanDirectory(fullPath, relativeFilePath);
          results.filesWithOldBranding.push(...subResults.filesWithOldBranding);
          results.totalFiles += subResults.totalFiles;
          results.directories.push(...subResults.directories);
        }
      } else if (entry.isFile()) {
        results.totalFiles++;
        
        // Check specific file types
        const ext = entry.name.split('.').pop();
        if (['ts', 'tsx', 'js', 'jsx', 'json', 'md', 'txt', 'css', 'html', 'yml', 'yaml'].includes(ext)) {
          const oldBranding = checkFileForOldBranding(fullPath);
          if (oldBranding.length > 0) {
            results.filesWithOldBranding.push({
              file: relativeFilePath,
              patterns: oldBranding
            });
          }
        }
      }
    }
  } catch (error) {
    console.log(`❌ Error scanning ${dirPath}: ${error.message}`);
  }
  
  return results;
}

// Function to check specific high-priority files
function checkHighPriorityFiles() {
  const highPriorityFiles = [
    'package.json',
    'README.md',
    'app/layout.tsx',
    'app/page.tsx',
    'next.config.mjs',
    'tailwind.config.ts',
  ];
  
  console.log('🎯 HIGH PRIORITY FILES CHECK:');
  console.log('============================');
  
  let allClean = true;
  
  highPriorityFiles.forEach(file => {
    const filePath = join(projectRoot, file);
    if (existsSync(filePath)) {
      const oldBranding = checkFileForOldBranding(filePath);
      if (oldBranding.length > 0) {
        console.log(`❌ ${file}: Contains ${oldBranding.join(', ')}`);
        allClean = false;
      } else {
        console.log(`✅ ${file}: Clean`);
      }
    } else {
      console.log(`⚠️  ${file}: File not found`);
    }
  });
  
  console.log('');
  return allClean;
}

// Function to check documentation files
function checkDocumentationFiles() {
  console.log('📚 DOCUMENTATION FILES CHECK:');
  console.log('=============================');
  
  const docDirs = ['docs', 'wiki', 'solosuccess documents'];
  let totalDocFiles = 0;
  let docFilesWithIssues = 0;
  
  docDirs.forEach(dir => {
    const dirPath = join(projectRoot, dir);
    if (existsSync(dirPath)) {
      console.log(`\n📁 Checking ${dir}/:`);
      const results = scanDirectory(dirPath, dir);
      totalDocFiles += results.totalFiles;
      docFilesWithIssues += results.filesWithOldBranding.length;
      
      results.filesWithOldBranding.forEach(item => {
        console.log(`   ❌ ${item.file}: ${item.patterns.join(', ')}`);
      });
      
      if (results.filesWithOldBranding.length === 0) {
        console.log(`   ✅ All files clean in ${dir}/`);
      }
    }
  });
  
  console.log(`\n📊 Documentation Summary: ${docFilesWithIssues}/${totalDocFiles} files need updates`);
  console.log('');
  return docFilesWithIssues === 0;
}

// Function to check media and assets
function checkMediaAssets() {
  console.log('🖼️  MEDIA & ASSETS CHECK:');
  console.log('=========================');
  
  const mediaDirs = ['public/images', 'public'];
  let mediaFiles = 0;
  let mediaFilesWithIssues = 0;
  
  mediaDirs.forEach(dir => {
    const dirPath = join(projectRoot, dir);
    if (existsSync(dirPath)) {
      console.log(`\n📁 Checking ${dir}/:`);
      const results = scanDirectory(dirPath, dir);
      mediaFiles += results.totalFiles;
      mediaFilesWithIssues += results.filesWithOldBranding.length;
      
      results.filesWithOldBranding.forEach(item => {
        console.log(`   ❌ ${item.file}: ${item.patterns.join(', ')}`);
      });
      
      if (results.filesWithOldBranding.length === 0) {
        console.log(`   ✅ All files clean in ${dir}/`);
      }
    }
  });
  
  console.log(`\n📊 Media Summary: ${mediaFilesWithIssues}/${mediaFiles} files need updates`);
  console.log('');
  return mediaFilesWithIssues === 0;
}

// Main execution
console.log('Starting comprehensive rebranding check...\n');

const highPriorityClean = checkHighPriorityFiles();
const documentationClean = checkDocumentationFiles();
const mediaClean = checkMediaAssets();

// Overall summary
console.log('📋 OVERALL REBRANDING STATUS:');
console.log('=============================');
console.log(`High Priority Files: ${highPriorityClean ? '✅ Complete' : '❌ Needs Work'}`);
console.log(`Documentation: ${documentationClean ? '✅ Complete' : '❌ Needs Work'}`);
console.log(`Media & Assets: ${mediaClean ? '✅ Complete' : '❌ Needs Work'}`);
console.log('');

if (highPriorityClean && documentationClean && mediaClean) {
  console.log('🎉 CONGRATULATIONS! All rebranding checks passed!');
  console.log('   Your SoloSuccess AI platform is ready to go!');
} else {
  console.log('⚠️  Some areas still need attention.');
  console.log('   Run the rebrand-automation.mjs script to fix remaining issues.');
}

console.log('');
console.log('💡 Next Steps:');
console.log('   1. Run: node scripts/rebrand-automation.mjs');
console.log('   2. Run: node scripts/rename-files-directories.mjs');
console.log('   3. Test your application thoroughly');
console.log('   4. Update external services and configurations');
