const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Fix common syntax errors introduced by linting script
    const fixes = [
      // Fix _< pattern at start of JSX
      { pattern: /\s+_</g, replacement: ' <' },
      
      // Fix malformed parameter destructuring
      { pattern: /\(_\{\s*([^}]+)\s*\}\s*:/g, replacement: '({ $1 :' },
      
      // Fix malformed className elements  
      { pattern: /<className=/g, replacement: '<div className=' },
      
      // Fix malformed key elements
      { pattern: /_<key=/g, replacement: '<div key=' },
      
      // Fix malformed map functions
      { pattern: /\.map\(_\(/g, replacement: '.map(' },
      
      // Fix malformed filter functions  
      { pattern: /\.filter\(_\(/g, replacement: '.filter(' },
      
      // Fix prefixed variables in destructuring
      { pattern: /\{\s*_([a-zA-Z_][a-zA-Z0-9_]*)\s*,/g, replacement: '{ $1,' },
      { pattern: /,\s*_([a-zA-Z_][a-zA-Z0-9_]*)\s*\}/g, replacement: ', $1 }' },
      { pattern: /,\s*_([a-zA-Z_][a-zA-Z0-9_]*)\s*,/g, replacement: ', $1,' },
      
      // Fix spread operator issues
      { pattern: /_\.\.\.([a-zA-Z_][a-zA-Z0-9_]*)/g, replacement: '...$1' },
      
      // Fix import issues
      { pattern: /import\s*\{\s*as\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\}/g, replacement: 'import { $1 }' }
    ];

    fixes.forEach(fix => {
      const newContent = content.replace(fix.pattern, fix.replacement);
      if (newContent !== content) {
        hasChanges = true;
        content = newContent;
      }
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix the main problematic files
const filesToFix = [
  'components/onboarding/onboarding-wizard.tsx',
  'components/ui/boss-card.tsx', 
  'components/ui/recaptcha-button.tsx',
  'components/subscription/subscription-manager.tsx',
  'components/ui/date-range-picker.tsx'
];

filesToFix.forEach(file => {
  const fullPath = path.resolve(file);
  if (fs.existsSync(fullPath)) {
    fixFile(fullPath);
  }
});

console.log('Syntax fixes completed!');