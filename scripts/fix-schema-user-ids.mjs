import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, '..', 'db', 'schema.ts');
let content = fs.readFileSync(schemaPath, 'utf8');

// Replace all user_id: varchar('user_id', { length: 255 }) with user_id: integer('user_id')
// This handles both .notNull() and non-.notNull() cases
const patterns = [
  {
    from: /user_id: varchar\('user_id', \{ length: 255 \}\)\.notNull\(\)/g,
    to: "user_id: integer('user_id').notNull()"
  },
  {
    from: /user_id: varchar\('user_id', \{ length: 255 \}\)/g,
    to: "user_id: integer('user_id')"
  }
];

let replaced = 0;
patterns.forEach(({ from, to }) => {
  const matches = content.match(from);
  if (matches) {
    replaced += matches.length;
    content = content.replace(from, to);
  }
});

fs.writeFileSync(schemaPath, content, 'utf8');
console.log(`✅ Replaced ${replaced} user_id varchar references with integer`);
console.log(`✅ Schema file updated: ${schemaPath}`);

