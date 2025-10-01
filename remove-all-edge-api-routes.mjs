import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiDir = path.join(__dirname, 'app', 'api');

console.log('Starting to remove Edge Runtime from all API routes...');

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && entry.name === 'route.ts') {
      processRouteFile(fullPath);
    }
  }
}

function processRouteFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let modified = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if this line contains the Edge Runtime export
      if (line.trim() === "export const runtime = 'edge'" || 
          line.trim() === 'export const runtime = "edge"') {
        // Replace with comment
        lines[i] = '// Edge Runtime disabled due to Node.js dependency incompatibility';
        modified = true;
        console.log(`✅ Fixed ${filePath}`);
        break;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Process all API routes
if (fs.existsSync(apiDir)) {
  processDirectory(apiDir);
  console.log('✅ Completed removing Edge Runtime from all API routes');
} else {
  console.error('❌ API directory not found');
}