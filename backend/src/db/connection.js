import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', '..', 'database.sqlite');

let db = null;

export function getDb() {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

// Query helpers
export function query(sql, params = []) {
  return getDb().prepare(sql).all(params);
}

export function queryOne(sql, params = []) {
  return getDb().prepare(sql).get(params);
}

export function execute(sql, params = []) {
  return getDb().prepare(sql).run(params);
}

export function transaction(fn) {
  const db = getDb();
  const txn = db.transaction(fn);
  return txn();
}
