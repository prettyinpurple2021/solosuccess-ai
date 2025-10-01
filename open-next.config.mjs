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
    'bcryptjs', 'jsonwebtoken', 'pg', 'better-auth', 'drizzle-orm', '@neondatabase/serverless',
    'pdf-parse', 'mammoth', 'exceljs', 'cheerio', 'openai', '@ai-sdk/openai', '@ai-sdk/anthropic', '@google/generative-ai',
    'sharp', 'canvas', 'puppeteer', 'playwright', 'jsdom', 'node-fetch', 'axios',
    'lodash', 'moment', 'uuid', 'crypto-js', 'bcrypt', 'jose',
    'next-auth', '@next-auth/core', '@next-auth/providers',
    'pg-native', 'sqlite3', 'mysql2', 'oracledb', 'tedious', 'pg-query-stream',
    'typeorm', 'prisma', '@prisma/client', 'mongoose', 'sequelize',
    'ws', 'socket.io', 'express', 'koa', 'fastify', 'hapi',
    'nodemailer', 'sendgrid', 'mailgun', 'aws-sdk', '@aws-sdk/client-s3',
    'redis', 'ioredis', 'bull', 'agenda', 'node-cron',
    'winston', 'pino', 'bunyan', 'debug', 'chalk',
    'yup', 'joi', 'ajv', 'class-validator', 'express-validator',
    'multer', 'formidable', 'busboy', 'file-type',
    'image-size', 'probe-image-size', 'gm', 'imagemagick',
    '@anthropic-ai/sdk', 'google-auth-library', 'googleapis',
    'stripe', 'paypal-rest-sdk', 'braintree',
    'twilio', 'node-telegram-bot-api', 'discord.js'
  ],
  // Enable tree shaking and minification
  minify: true,
  buildCommand: "npm run build",
}

export default config