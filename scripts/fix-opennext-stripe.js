#!/usr/bin/env node

/**
 * Fix Stripe package.json in .open-next to use node file instead of missing worker file
 */

const fs = require('fs');
const path = require('path');

const stripePackageJsonPath = path.join(__dirname, '..', '.open-next', 'server-functions', 'default', 'node_modules', 'stripe', 'package.json');

if (fs.existsSync(stripePackageJsonPath)) {
  console.log('🔧 Fixing Stripe package.json in .open-next...');
  
  const packageJson = JSON.parse(fs.readFileSync(stripePackageJsonPath, 'utf8'));
  
  // Replace all .worker.js references with .node.js
  const packageJsonString = JSON.stringify(packageJson, null, 2);
  const fixedPackageJsonString = packageJsonString.replace(/stripe\.esm\.worker\.js/g, 'stripe.esm.node.js')
                                                 .replace(/stripe\.cjs\.worker\.js/g, 'stripe.cjs.node.js');
  
  fs.writeFileSync(stripePackageJsonPath, fixedPackageJsonString);
  console.log('✅ Successfully fixed Stripe package.json in .open-next');
} else {
  console.log('⚠️  Stripe package in .open-next not found');
}
