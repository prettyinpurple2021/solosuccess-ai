import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting comprehensive Edge Runtime removal...');

// Get all files that contain Edge Runtime exports
function findAllEdgeRuntimeFiles() {
  const files = [];
  
  function searchDirectory(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          searchDirectory(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes("export const runtime = 'edge'") || content.includes('export const runtime = "edge"')) {
              files.push(fullPath);
            }
          } catch (error) {
            // Skip files we can't read
          }
        }
      }
    } catch (error) {
      // Skip directories we can't access
    }
  }
  
  // Only search API directory
  const apiDir = path.join(__dirname, 'app', 'api');
  if (fs.existsSync(apiDir)) {
    searchDirectory(apiDir);
  }
  
  return files;
}

function removeEdgeRuntime(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let modified = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check for Edge Runtime export patterns
      if (line.trim() === "export const runtime = 'edge'" || 
          line.trim() === 'export const runtime = "edge"' ||
          line.includes("export const runtime = 'edge'") ||
          line.includes('export const runtime = "edge"')) {
        lines[i] = '// Edge Runtime disabled due to Node.js dependency incompatibility';
        modified = true;
        break;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
      console.log(`✅ Fixed ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Find and process all files
const edgeRuntimeFiles = findAllEdgeRuntimeFiles();
console.log(`Found ${edgeRuntimeFiles.length} files with Edge Runtime`);

let fixedCount = 0;
for (const file of edgeRuntimeFiles) {
  if (removeEdgeRuntime(file)) {
    fixedCount++;
  }
}

console.log(`✅ Fixed ${fixedCount} out of ${edgeRuntimeFiles.length} files`);
console.log('✅ Edge Runtime removal completed');