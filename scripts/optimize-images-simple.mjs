#!/usr/bin/env node

/**
 * Simple Image Optimization Script
 * Uses built-in Node.js tools to optimize images
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'public', 'images');
const optimizedDir = path.join(process.cwd(), 'public', 'images', 'optimized');

// Ensure optimized directory exists
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

// Image optimization settings
const sizes = [
  { width: 640, suffix: '-sm' },
  { width: 750, suffix: '-md' },
  { width: 1080, suffix: '-lg' },
  { width: 1920, suffix: '-xl' },
];

function getImageFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getImageFiles(fullPath));
    } else if (/\.(jpg|jpeg|png)$/i.test(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function optimizeImage(inputPath) {
  const relativePath = path.relative(imagesDir, inputPath);
  const dir = path.dirname(relativePath);
  const name = path.basename(inputPath, path.extname(inputPath));
  
  console.log(`Optimizing: ${relativePath}`);
  
  // Create subdirectory in optimized folder if needed
  const outputDir = path.join(optimizedDir, dir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    // Try using ImageMagick if available
    const hasImageMagick = () => {
      try {
        execSync('magick --version', { stdio: 'pipe' });
        return true;
      } catch {
        try {
          execSync('convert --version', { stdio: 'pipe' });
          return true;
        } catch {
          return false;
        }
      }
    };

    if (hasImageMagick()) {
      console.log('  Using ImageMagick for optimization');
      
      // Generate WebP versions
      for (const size of sizes) {
        const webpPath = path.join(outputDir, `${name}${size.suffix}.webp`);
        const command = `magick "${inputPath}" -resize ${size.width}x${size.width} -quality 80 "${webpPath}"`;
        
        try {
          execSync(command, { stdio: 'pipe' });
          console.log(`  ✓ Created ${path.basename(webpPath)}`);
        } catch (error) {
          console.warn(`  ⚠ Failed to create ${path.basename(webpPath)}: ${error.message}`);
        }
      }
      
      // Create a fallback WebP version (original size)
      const fallbackWebpPath = path.join(outputDir, `${name}.webp`);
      const command = `magick "${inputPath}" -quality 80 "${fallbackWebpPath}"`;
      
      try {
        execSync(command, { stdio: 'pipe' });
        console.log(`  ✓ Created ${path.basename(fallbackWebpPath)}`);
      } catch (error) {
        console.warn(`  ⚠ Failed to create ${path.basename(fallbackWebpPath)}: ${error.message}`);
      }
    } else {
      // Fallback: just copy files with optimized names for Next.js to handle
      console.log('  ImageMagick not found, creating placeholder optimized files');
      
      for (const size of sizes) {
        const webpPath = path.join(outputDir, `${name}${size.suffix}.webp`);
        const jpgPath = path.join(outputDir, `${name}${size.suffix}.jpg`);
        
        // Copy original file as placeholder
        try {
          fs.copyFileSync(inputPath, jpgPath);
          console.log(`  ✓ Created placeholder ${path.basename(jpgPath)}`);
        } catch (error) {
          console.warn(`  ⚠ Failed to create placeholder ${path.basename(jpgPath)}: ${error.message}`);
        }
      }
      
      // Create a fallback version
      const fallbackPath = path.join(outputDir, `${name}.jpg`);
      try {
        fs.copyFileSync(inputPath, fallbackPath);
        console.log(`  ✓ Created fallback ${path.basename(fallbackPath)}`);
      } catch (error) {
        console.warn(`  ⚠ Failed to create fallback: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error(`Failed to optimize ${relativePath}: ${error.message}`);
  }
}

async function main() {
  console.log('🖼️  Starting simple image optimization...\n');
  
  const imageFiles = getImageFiles(imagesDir);
  
  if (imageFiles.length === 0) {
    console.log('No images found to optimize.');
    return;
  }
  
  console.log(`Found ${imageFiles.length} images to optimize:\n`);
  
  for (const imageFile of imageFiles) {
    optimizeImage(imageFile);
  }
  
  console.log('\n✅ Image optimization complete!');
  console.log(`\nOptimized images saved to: ${optimizedDir}`);
  console.log('\nNote: For best results, install ImageMagick:');
  console.log('- Windows: choco install imagemagick');
  console.log('- macOS: brew install imagemagick');
  console.log('- Linux: apt-get install imagemagick');
}

main().catch(console.error);
