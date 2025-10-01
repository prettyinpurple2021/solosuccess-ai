#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function findApiRoutes(dir) {
  const files = [];
  
  function walk(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item === 'route.ts') {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

function addEdgeRuntime(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if runtime export already exists
    if (content.includes('export const runtime')) {
      console.log(`Runtime export already exists in: ${filePath}`);
      return;
    }
    
    console.log(`Adding Edge Runtime to: ${filePath}`);
    
    // Find the right place to insert the runtime export
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Find the last import line or variable declaration
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('import ') || line.startsWith('const ') || line === '') {
        insertIndex = i + 1;
      } else if (line.startsWith('export') || line.startsWith('function') || line.startsWith('class')) {
        break;
      }
    }
    
    // Insert the runtime export
    const newLines = [
      ...lines.slice(0, insertIndex),
      '',
      'export const runtime = \'edge\'',
      '',
      ...lines.slice(insertIndex)
    ];
    
    const newContent = newLines.join('\n');
    fs.writeFileSync(filePath, newContent);
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Main execution
const apiDir = path.join(process.cwd(), 'app', 'api');
const apiRoutes = findApiRoutes(apiDir);

console.log(`Found ${apiRoutes.length} API route files`);

for (const route of apiRoutes) {
  addEdgeRuntime(route);
}

console.log('Completed adding Edge Runtime exports to all API routes');