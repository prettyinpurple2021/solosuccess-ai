import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

// Lazy database connection to avoid build-time database calls
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    const client = neon(process.env.DATABASE_URL!);
    _db = drizzle({
      schema,
      client,
    });
  }
  return _db;
}

// Export db for backward compatibility, but it will only be created when first accessed
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  }
});
