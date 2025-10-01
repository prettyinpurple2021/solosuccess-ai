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
  // Exclude large packages from server bundle
  serverExternalPackages: [
    'bcryptjs',
    'jsonwebtoken', 
    'pg',
    'better-auth',
    'drizzle-orm',
    '@neondatabase/serverless',
    'pdf-parse',
    'mammoth',
    'exceljs',
    'cheerio',
    'openai',
    '@ai-sdk/openai',
    '@ai-sdk/anthropic',
    '@google/generative-ai'
  ],
  // Enable tree shaking and minification
  minify: true,
  buildCommand: "npm run build",
}

export default config