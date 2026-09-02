import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { env } from '../config/env';

async function initDb() {
  const connectionString = env.DIRECT_URL || env.DATABASE_URL;
  console.log('Connecting to database...');

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    const schemaPath = path.join(__dirname, '../config/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running schema migrations...');
    await pool.query(sql);
    console.log('✅ Database schema and views initialized successfully!');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDb();
