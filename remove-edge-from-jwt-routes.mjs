import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes that use JWT and need to be removed from Edge Runtime
const jwtRoutes = [
  'app/api/auth/signin/route.ts',
  'app/api/auth/signup/route.ts',
  'app/api/briefcase/parse-content/route.ts', // uses pdf-parse with fs module
  'app/api/briefcase/route.ts',
  'app/api/profile/route.ts',
  'app/api/surveys/exit-intent/route.ts',
  'app/api/auth/user/route.ts',
  'app/api/learning/skills/route.ts',
  'app/api/unified-briefcase/route.ts',
  'app/api/auth/signin/route-new.ts',
  'app/api/briefcase/files/[id]/share-links/route.ts',
  'app/api/briefcases/route.ts',
  'app/api/dashboard/route.ts',
  'app/api/learning/modules/route.ts',
  'app/api/shared/[shareId]/route.ts',
  'app/api/avatar/upload/route.ts',
  'app/api/learning/route.ts',
  'app/api/preferences/route.ts',
  'app/api/templates/route.ts'
];

let updatedCount = 0;

console.log('Removing Edge Runtime from JWT-dependent routes...');

jwtRoutes.forEach(routePath => {
  const fullPath = path.join(__dirname, routePath);
  
  if (fs.existsSync(fullPath)) {
    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Check if file has Edge Runtime export
      if (content.includes("export const runtime = 'edge'")) {
        // Replace the export with a comment
        content = content.replace(
          /export const runtime = 'edge'/g,
          "// Removed Edge Runtime due to Node.js dependencies (jsonwebtoken, bcrypt, fs, etc.)\n// export const runtime = 'edge'"
        );
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Updated: ${routePath}`);
        updatedCount++;
      } else {
        console.log(`⚪ Skipped: ${routePath} (no Edge Runtime found)`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${routePath}:`, error.message);
    }
  } else {
    console.log(`⚪ Skipped: ${routePath} (file not found)`);
  }
});

console.log(`\n🎉 Complete! Updated ${updatedCount} files.`);