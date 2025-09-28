/** @type {import('@opennextjs/cloudflare').Config} */
export default {
  // CloudFlare Workers configuration
  cloudflare: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    zoneId: process.env.CLOUDFLARE_ZONE_ID,
    wranglerConfigPath: './wrangler.toml',
  },
  
  // Build configuration
  buildCommand: 'npm run build',
  outputDir: '.opennext',
  
  // Environment variables
  env: {
    NODE_ENV: 'production',
  },
  
  // Custom domains (optional)
  domains: process.env.CUSTOM_DOMAINS?.split(',') || [],
}
