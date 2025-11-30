#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Find all TypeScript/TSX files
const files = await glob('**/*.{ts,tsx}', {
  ignore: ['node_modules/**', '.next/**', 'dist/**']
});

function fixReactImports(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let newContent = content;
    let hasChanges = false;
    
    // Fix React imports that are missing React namespace
    const patterns = [
      // Pattern 1: import { useEffect, useState } from "react"
      {
        regex: /^import \{ ([^}]+) \} from "react"$/gm,
        replacement: 'import React, { $1 } from "react"'
      },
      // Pattern 2: import { Component } from "react" (when React is not imported)
      {
        regex: /^import \{ (?!React)([^}]+) \} from "react"$/gm,
        replacement: 'import React, { $1 } from "react"'
      }
    ];
    
    patterns.forEach(pattern => {
      const result = newContent.replace(pattern.regex, pattern.replacement);
      if (result !== newContent) {
        newContent = result;
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      fs.writeFileSync(fullPath, newContent, 'utf8');
      console.log(`Fixed React imports: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

console.log('Fixing React import issues...');
for (const file of files) {
  fixReactImports(file);
}
console.log('Done!');
