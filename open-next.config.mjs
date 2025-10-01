/** @type {import('@opennextjs/aws').OpenNextConfig} */
const config = {
  default: {
    override: {
      wrapper: "cloudflare",
      converter: "edge",
      // Optimize bundle size for Cloudflare Pages 25MB limit
      experimentalBundledNextServer: true,
    },
  },
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare",
      converter: "edge",
    },
  },
  // Exclude large packages from server bundle - comprehensive list for 25MB limit
  serverExternalPackages: [
    // Core auth and database (heaviest)
    'bcryptjs', 'jsonwebtoken', 'pg', '@neondatabase/serverless', 'better-auth', 'drizzle-orm', 'drizzle-kit',
    // AI SDK packages (very heavy)
    'openai', '@ai-sdk/openai', '@ai-sdk/anthropic', '@ai-sdk/google', '@google/generative-ai', 'ai',
    // File processing (heavy)
    'pdf-parse', 'mammoth', 'exceljs', 'cheerio', 'node-html-parser', 'sharp',
    // Browser automation and testing (extremely heavy)
    'playwright', 'puppeteer', '@vitest/browser', '@vitest/coverage-v8', 'vitest', 'storybook',
    // Build and bundling tools (heavy)
    'webpack-bundle-analyzer', 'webpack', 'eslint', '@typescript-eslint/eslint-plugin', '@typescript-eslint/parser',
    // Payment processing
    'stripe', 'resend',
    // Development tools
    'nodemon', 'concurrently', 'dotenv-cli', 'ts-jest', 'jest', '@jest/globals',
    // Large UI libraries that might have server components (removed conflicting packages)
    // Additional heavy packages for final size reduction
    'next-themes', 'react-hook-form', '@hookform/resolvers', 'zod',
    'class-variance-authority', 'tailwind-merge', 'clsx', 'cmdk',
    'sonner', 'vaul', 'input-otp', 'embla-carousel-react', 'react-day-picker',
    'react-resizable-panels', 'swr', 'web-push', 'robots-parser', 'js-yaml',
    'uuid', 'node-fetch', 'flags', 'glob', 'buffer', 'crypto-browserify',
    'stream-browserify', 'dotenv', 'cross-env', 'postcss', 'tailwindcss',
    'tailwindcss-animate', 'autoprefixer', 'tsx', 'ts-node', 'wrangler'
  ],
  // Enable tree shaking and minification
  minify: true,
  buildCommand: "npm run build",
}

export default config