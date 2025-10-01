import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find all routes with Edge Runtime
function findAllEdgeRoutes() {
  const routes = [];
  
  function searchDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        searchDir(fullPath);
      } else if (entry.name === 'route.ts' || entry.name === 'route.tsx') {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes("export const runtime = 'edge'")) {
            routes.push(path.relative(__dirname, fullPath));
          }
        } catch (error) {
          console.error(`Error reading ${fullPath}:`, error.message);
        }
      }
    }
  }
  
  searchDir(path.join(__dirname, 'app', 'api'));
  return routes;
}

// Check if route uses problematic dependencies
function usesProblematicDeps(content) {
  const problematicPatterns = [
    /authenticateRequest/,
    /jsonwebtoken|jwt/,
    /bcrypt/,
    /auth-server/,
    /pg(?![a-zA-Z])/,  // pg but not part of another word
    /pdf-parse/,
    /fs(?![a-zA-Z])/,   // fs but not part of another word
    /web-push/,
    /'crypto'|"crypto"/,
    /'stream'|"stream"/,
    /'http'|"http"/,
    /'https'|"https"/,
    /'net'|"net"/
  ];
  
  return problematicPatterns.some(pattern => pattern.test(content));
}

let updatedCount = 0;
let skippedCount = 0;

console.log('Finding all API routes with Edge Runtime...');

const edgeRoutes = findAllEdgeRoutes();
console.log(`Found ${edgeRoutes.length} routes with Edge Runtime.`);

console.log('\nAnalyzing and removing Edge Runtime from problematic routes...');

edgeRoutes.forEach(routePath => {
  const fullPath = path.join(__dirname, routePath);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if this route uses problematic dependencies
    const hasProblematicDeps = usesProblematicDeps(content);
    
    if (hasProblematicDeps) {
      // Replace the export with a comment
      content = content.replace(
        /export const runtime = 'edge'/g,
        "// Removed Edge Runtime due to Node.js dependencies (JWT, auth, fs, crypto, etc.)\n// export const runtime = 'edge'"
      );
      
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Updated: ${routePath}`);
      updatedCount++;
    } else {
      console.log(`⚪ Skipped: ${routePath} (no problematic dependencies detected)`);
      skippedCount++;
    }
  } catch (error) {
    console.error(`❌ Error processing ${routePath}:`, error.message);
  }
});

console.log(`\n🎉 Complete!`);
console.log(`📊 Summary:`);
console.log(`   - Updated: ${updatedCount} files`);
console.log(`   - Skipped: ${skippedCount} files`);
console.log(`   - Total processed: ${edgeRoutes.length} files`);