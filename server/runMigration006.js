import pool from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, 'migrations/006_add_base_currency_to_users.sql'),
      'utf8'
    );

    console.log('🚀 Running migration 006...');
    await pool.query(sql);
    console.log('✅ Migration 006 completed!');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
