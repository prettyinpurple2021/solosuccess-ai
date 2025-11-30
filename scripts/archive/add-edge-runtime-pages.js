#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of dynamic pages that need Edge Runtime based on the error log
const dynamicPages = [
  'app/blog/page.tsx',
  'app/blog/how-to-automate-revenue-workflows/page.tsx',
  'app/blog/how-to-build-marketing-system-with-ai/page.tsx', 
  'app/blog/how-to-scale-a-solo-business/page.tsx',
  'app/dashboard/collaboration/sessions/[id]/page.tsx',
  'app/dashboard/competitors/[id]/page.tsx',
  'app/dashboard/competitors/[id]/edit/page.tsx',
  'app/handler/[...stack]/page.tsx',
  'app/pricing/page.tsx',
  'app/pricing/accelerator/page.tsx',
  'app/pricing/dominator/page.tsx', 
  'app/pricing/launch/page.tsx',
  'app/templates/[templateSlug]/page.tsx'
];

function addEdgeRuntimeToPage(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }

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
    
    // Find the last import line or other exports
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('import ') || 
          line.startsWith('export const dynamic') ||
          line.startsWith('export const revalidate') ||
          line.startsWith('export const metadata') ||
          line === '') {
        insertIndex = i + 1;
      } else if (line.startsWith('export default') || line.startsWith('function') || line.startsWith('const')) {
        break;
      }
    }
    
    // Insert the runtime export
    const newLines = [
      ...lines.slice(0, insertIndex),
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
console.log(`Processing ${dynamicPages.length} dynamic pages`);

for (const pageFile of dynamicPages) {
  const fullPath = path.join(process.cwd(), pageFile);
  addEdgeRuntimeToPage(fullPath);
}

console.log('Completed adding Edge Runtime exports to dynamic pages');