#!/usr/bin/env node

/**
 * Postinstall script to fix Stripe package.json for Cloudflare compatibility
 * This script modifies the Stripe package exports to work with OpenNext Cloudflare bundler
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stripePackageJsonPath = path.join(__dirname, '..', 'node_modules', 'stripe', 'package.json');

if (fs.existsSync(stripePackageJsonPath)) {
  console.log('📦 Patching Stripe package.json for Cloudflare compatibility...');
  
  const content = fs.readFileSync(stripePackageJsonPath, 'utf8');
  
  // Replace all worker file references with node file references
  const patchedContent = content
    .replace(/stripe\.esm\.worker\.js/g, 'stripe.esm.node.js')
    .replace(/stripe\.cjs\.worker\.js/g, 'stripe.cjs.node.js');
  
  fs.writeFileSync(stripePackageJsonPath, patchedContent);
  console.log('✅ Successfully patched Stripe package.json');
} else {
  console.log('⚠️  Stripe package not found, skipping patch');
}
