import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { schema, seedData } from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', '..', 'database.sqlite');

console.log('Initializing database at:', dbPath);

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Execute schema
db.exec(schema);
console.log('✓ Database schema created');

// Seed initial data
db.exec(seedData);
console.log('✓ Sample data seeded');

db.close();
console.log('✓ Database initialization complete');
