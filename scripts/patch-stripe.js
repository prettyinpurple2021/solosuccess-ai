#!/usr/bin/env node

/**
 * Postinstall script to fix Stripe package.json for Cloudflare compatibility
 * This script modifies the Stripe package exports to work with OpenNext Cloudflare bundler
 */

const fs = require('fs');
const path = require('path');

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
