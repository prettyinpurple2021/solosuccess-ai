#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts large images to modern formats (WebP, AVIF) and optimizes sizes
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

// Quality settings
const webpQuality = 80;
const avifQuality = 70;

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
    // Generate WebP versions
    for (const size of sizes) {
      const webpPath = path.join(outputDir, `${name}${size.suffix}.webp`);
      const command = `npx sharp-cli resize ${size.width} --format webp --quality ${webpQuality} "${inputPath}" --output "${webpPath}"`;
      
      try {
        execSync(command, { stdio: 'pipe' });
        console.log(`  ✓ Created ${path.basename(webpPath)}`);
      } catch (error) {
        console.warn(`  ⚠ Failed to create ${path.basename(webpPath)}: ${error.message}`);
      }
    }
    
    // Generate AVIF versions (for modern browsers)
    for (const size of sizes.slice(0, 2)) { // Only create smaller sizes for AVIF
      const avifPath = path.join(outputDir, `${name}${size.suffix}.avif`);
      const command = `npx sharp-cli resize ${size.width} --format avif --quality ${avifQuality} "${inputPath}" --output "${avifPath}"`;
      
      try {
        execSync(command, { stdio: 'pipe' });
        console.log(`  ✓ Created ${path.basename(avifPath)}`);
      } catch (error) {
        console.warn(`  ⚠ Failed to create ${path.basename(avifPath)}: ${error.message}`);
      }
    }
    
    // Create a fallback WebP version (original size)
    const fallbackWebpPath = path.join(outputDir, `${name}.webp`);
    const command = `npx sharp-cli --format webp --quality ${webpQuality} "${inputPath}" --output "${fallbackWebpPath}"`;
    
    try {
      execSync(command, { stdio: 'pipe' });
      console.log(`  ✓ Created ${path.basename(fallbackWebpPath)}`);
    } catch (error) {
      console.warn(`  ⚠ Failed to create ${path.basename(fallbackWebpPath)}: ${error.message}`);
    }
    
  } catch (error) {
    console.error(`Failed to optimize ${relativePath}: ${error.message}`);
  }
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');
  
  // Check if sharp-cli is available
  try {
    execSync('npx sharp-cli --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('Installing sharp-cli for image optimization...');
    execSync('npm install -g sharp-cli', { stdio: 'inherit' });
  }
  
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
  console.log('\nTo use optimized images in your app:');
  console.log('1. Import the optimized images in your components');
  console.log('2. Use Next.js Image component with srcSet for responsive images');
  console.log('3. Consider using a picture element for format selection');
}

main().catch(console.error);

