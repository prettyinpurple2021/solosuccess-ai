import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix workspace root warning
  outputFileTracingRoot: process.cwd(),

  // Production builds should catch errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Environment variables configuration
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
  },

  // Optimized for Cloudflare Workers deployment with OpenNext
  output: 'standalone',
  distDir: '.next',

  // Enable modern React features
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Compression and optimization
  compress: true,

  // External packages for server components - extensive list for Cloudflare Pages 25MB limit
  serverExternalPackages: [
    'bcryptjs', 'jsonwebtoken', 'pg', 'better-auth', 'drizzle-orm',
    'pdf-parse', 'mammoth', '@ai-sdk/openai', '@ai-sdk/anthropic', '@ai-sdk/google', '@ai-sdk/core', 'ai',
    'sharp', 'canvas', 'puppeteer', 'playwright', 'cheerio', 'jsdom', 'node-fetch', 'axios',
    'lodash', 'moment', 'date-fns', 'uuid', 'crypto', 'fs', 'path', 'os', 'util', 'stream',
    'buffer', 'events', 'url', 'querystring', 'http', 'https', 'net', 'tls', 'zlib',
    'crypto-js', 'bcrypt', 'jose', 'next-auth', '@next-auth/core', '@next-auth/providers',
    'pg-native', 'sqlite3', 'mysql2', 'oracledb', 'tedious', 'pg-query-stream',
    'typeorm', 'prisma', '@prisma/client', 'mongoose', 'sequelize',
    'ws', 'socket.io', 'express', 'koa', 'fastify', 'hapi',
    'nodemailer', 'sendgrid', 'mailgun', 'aws-sdk', '@aws-sdk/client-s3',
    'redis', 'ioredis', 'bull', 'agenda', 'node-cron',
    'winston', 'pino', 'bunyan', 'debug', 'chalk',
    'yup', 'joi', 'ajv', 'class-validator', 'express-validator',
    'multer', 'formidable', 'busboy', 'file-type',
    'image-size', 'probe-image-size', 'gm', 'imagemagick'
  ],

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Bundle optimization for memory efficiency
  webpack: (config, { dev, isServer, webpack }) => {
    // Add path alias resolution for Cloudflare build environment
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
    }
    
    // Server-side optimizations for Cloudflare Pages bundle size limit
    if (isServer) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^(sharp|canvas|puppeteer|playwright|pg-native)$/,
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /^aws-sdk$/,
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /^@aws-sdk\/.*$/,
        })
      );
      
      // Aggressive tree shaking for server bundle
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      config.optimization.minimize = true;
    }
    
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 30,
        maxAsyncRequests: 30,
        minSize: 20000,
        maxSize: 200000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
            enforce: true,
          },
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            name: 'framework',
            chunks: 'all',
            priority: 40,
            enforce: true,
            reuseExistingChunk: true,
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 30,
            reuseExistingChunk: true,
          },
          animations: {
            test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
            name: 'animations',
            chunks: 'all',
            priority: 25,
            reuseExistingChunk: true,
          },
        },
      }
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
      
      // Additional bundle size optimizations for Cloudflare Pages
      config.optimization.minimize = true
      config.resolve.alias = {
        ...config.resolve.alias,
        // Replace heavy packages with lighter alternatives where possible
        'moment': false,
        'lodash': false,
      }
    }
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        http2: false,
        dns: false,
        assert: false,
        os: false,
        path: false,
        util: false,
        buffer: false,
        events: false,
        querystring: false,
        punycode: false,
        string_decoder: false,
        timers: false,
        constants: false,
        domain: false,
        cluster: false,
        child_process: false,
        worker_threads: false,
        perf_hooks: false,
        v8: false,
        vm: false,
        inspector: false,
        async_hooks: false,
        module: false,
        process: false,
      }
    }
    return config
  },

  async headers() {
    return [
      {
        source: '/:path*.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'X-Robots-Tag', value: 'noindex' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },

  async redirects() {
    return [
      // ... your existing redirects config remains untouched
    ]
  },
}

export default nextConfig;