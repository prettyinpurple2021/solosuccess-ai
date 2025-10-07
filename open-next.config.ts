// OpenNext configuration optimized for Cloudflare Pages 25MB limit
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
	incrementalCache: r2IncrementalCache,
	
	// Aggressive bundle optimization - focus on size reduction
	esbuild: {
		// Mark heavy packages as external to prevent bundling
		external: [
			// Core heavy packages (most impactful)
			'stripe',
			'resend', 
			'@neondatabase/serverless',
			'pg',
			'bcryptjs',
			'better-auth',
			'drizzle-orm',
			'drizzle-kit',
			// Heavy processing libraries (moved to workers or removed)
			'sharp',
			'node-html-parser',
			// Testing/dev tools (should not be in production)
			'playwright',
			'puppeteer',
			'vitest',
			'jest',
			'storybook',
			'webpack-bundle-analyzer',
			// Additional potentially heavy deps
			'jsonwebtoken',
			'web-push',
			// Large frameworks/libraries
			'framer-motion',
			'recharts',
			'react-hook-form',
			'@hookform/resolvers',
			'zod'
		],
		// Enable maximum compression
		minify: true,
		treeShaking: true,
		// Target modern edge runtime for smaller polyfills
		target: ['es2022'],
		format: 'esm',
		// Aggressive minification options
		minifySyntax: true,
		minifyWhitespace: true,
		minifyIdentifiers: true,
		// Drop console statements in production
		drop: ['console', 'debugger'],
		// Additional size optimizations
		mangleProps: /^_/,
		legalComments: 'none'
	}
});
