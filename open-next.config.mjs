/** @type {import('@opennextjs/cloudflare').OpenNextConfig} */
const config = {
  default: {
    override: {
      wrapper: "cloudflare",
      converter: "edge",
      // Optimize bundle size for Cloudflare Pages 25MB limit
      experimentalBundledNextServer: true,
      // Custom esbuild configuration to handle Stripe and AWS packages
      experimentalBundleOptions: {
        external: [
          'stripe',
          '@aws-sdk/client-cloudfront',
          '@aws-sdk/client-dynamodb', 
          '@aws-sdk/client-sso',
          '@aws-sdk/credential-provider-node',
          '@aws-sdk/credential-provider-env',
          '@aws-sdk/credential-provider-ini',
          '@aws-sdk/credential-provider-process',
          '@aws-sdk/credential-provider-sso',
          '@aws-sdk/credential-provider-web-identity',
          '@aws-sdk/core',
          '@aws-sdk/middleware-endpoint-discovery',
          '@aws-sdk/middleware-host-header',
          '@aws-sdk/middleware-logger',
          '@aws-sdk/middleware-recursion-detection',
          '@aws-sdk/middleware-user-agent',
          '@aws-sdk/region-config-resolver',
          '@aws-sdk/types',
          '@aws-sdk/util-endpoints',
          '@aws-sdk/util-user-agent-browser',
          '@aws-sdk/util-user-agent-node',
          '@aws-sdk/xml-builder',
          '@aws-crypto/crc32',
          '@aws-crypto/crc32c',
          '@aws-crypto/ie11-detection',
          '@aws-crypto/sha1-browser',
          '@aws-crypto/sha256-browser',
          '@aws-crypto/sha256-js',
          '@aws-crypto/supports-web-crypto',
          '@aws-crypto/util',
          '@smithy/util-middleware',
          '@smithy/types',
          '@smithy/core',
          '@smithy/util-endpoints',
          '@smithy/signature-v4'
        ],
      }
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
    'uuid', 'node-fetch', 'flags', 'glob', 'dotenv', 'cross-env', 'postcss', 'tailwindcss',
    'tailwindcss-animate', 'autoprefixer', 'tsx', 'ts-node', 'wrangler',
    // AWS packages (not needed for Cloudflare deployment)
    '@aws-sdk/client-cloudfront', '@aws-sdk/client-dynamodb', '@aws-sdk/client-sso',
    '@aws-sdk/credential-provider-node', '@aws-sdk/credential-provider-env',
    '@aws-sdk/credential-provider-ini', '@aws-sdk/credential-provider-process',
    '@aws-sdk/credential-provider-sso', '@aws-sdk/credential-provider-web-identity',
    '@aws-sdk/core', '@aws-sdk/middleware-endpoint-discovery', '@aws-sdk/middleware-host-header',
    '@aws-sdk/middleware-logger', '@aws-sdk/middleware-recursion-detection',
    '@aws-sdk/middleware-user-agent', '@aws-sdk/region-config-resolver', '@aws-sdk/types',
    '@aws-sdk/util-endpoints', '@aws-sdk/util-user-agent-browser', '@aws-sdk/util-user-agent-node',
    '@aws-sdk/xml-builder', '@aws-crypto/crc32', '@aws-crypto/crc32c', '@aws-crypto/ie11-detection',
    '@aws-crypto/sha1-browser', '@aws-crypto/sha256-browser', '@aws-crypto/sha256-js',
    '@aws-crypto/supports-web-crypto', '@aws-crypto/util', '@smithy/util-middleware',
    '@smithy/types', '@smithy/core', '@smithy/util-endpoints', '@smithy/signature-v4'
  ],
  // Enable tree shaking and minification
  minify: true,
  buildCommand: "npm run build",
}

export default config