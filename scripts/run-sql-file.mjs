#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  const [,, sqlPathArg] = process.argv
  if (!sqlPathArg) {
    console.error('Usage: node scripts/run-sql-file.mjs <path-to-sql>')
    process.exit(1)
  }

  const sqlPath = path.isAbsolute(sqlPathArg) ? sqlPathArg : path.join(process.cwd(), sqlPathArg)
  if (!fs.existsSync(sqlPath)) {
    console.error(`SQL file not found: ${sqlPath}`)
    process.exit(1)
  }

  const sql = fs.readFileSync(sqlPath, 'utf8')
  const DATABASE_URL = process.env.DATABASE_URL
  if (!DATABASE_URL) {
    console.error('Missing DATABASE_URL in .env.local')
    process.exit(1)
  }

  const pool = new Pool({ connectionString: DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false })
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(sql)
    await client.query('COMMIT')
    console.log('✅ Executed SQL successfully:', path.basename(sqlPath))
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ Failed executing SQL:', err.message)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main()


