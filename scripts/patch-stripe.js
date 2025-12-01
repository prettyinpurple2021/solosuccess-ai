#!/usr/bin/env node

/**
 * Postinstall script - placeholder for future package patching if needed
 * Currently not patching any packages as deployment is platform-agnostic
 */

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const stripePackageJsonPath = join(__dirname, '..', 'node_modules', 'stripe', 'package.json');

// Verify Stripe is installed for reference, but don't patch
if (existsSync(stripePackageJsonPath)) {
  console.log('✅ Stripe package verified');
} else {
  console.log('⚠️  Stripe package not found');
}
