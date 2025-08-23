import pg from 'pg';
import Database from 'better-sqlite3';
import { config } from '../config/env.js';
import { setupSQLiteDemo } from './sqlite-setup.js';

const { Pool } = pg;

// Database state
let pool: pg.Pool | null = null;
let sqliteDb: Database.Database | null = null;
let usingPostgres = false;
let initialized = false;

// Initialize database connection
async function initializeDatabase() {
  if (initialized) return;
  
  try {
    if (config.database.url.includes('postgresql://') && !config.database.url.includes('localhost')) {
      pool = new Pool({
        connectionString: config.database.url,
        ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false
      });
      
      // Test connection with timeout
      const testQuery = pool.query('SELECT 1');
      await Promise.race([
        testQuery,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 3000))
      ]);
      
      console.log('✅ Connected to PostgreSQL database');
      usingPostgres = true;
    } else {
      throw new Error('Using SQLite demo database');
    }
  } catch (error) {
    console.log('⚠️  PostgreSQL not available, using SQLite demo database');
    sqliteDb = setupSQLiteDemo();
    console.log('✅ Connected to SQLite demo database');
    usingPostgres = false;
  }
  
  initialized = true;
}

export const query = async (text: string, params?: any[]): Promise<any> => {
  // Initialize on first query
  if (!initialized) {
    await initializeDatabase();
  }
  
  const start = Date.now();
  
  try {
    if (usingPostgres && pool) {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed PostgreSQL query', { duration, rows: res.rowCount });
      return res;
    } else if (sqliteDb) {
      // Convert PostgreSQL queries to SQLite (basic conversion)
      let sqliteQuery = text
        .replace(/\$(\d+)/g, '?')  // Replace $1, $2 with ?
        .replace(/RETURNING \*/g, '')  // Remove RETURNING clauses
        .replace(/UUID/g, 'TEXT')  // Replace UUID with TEXT
        .replace(/INTEGER\[\]/g, 'TEXT')  // Replace arrays with TEXT
        .replace(/gen_random_uuid\(\)/g, 'lower(hex(randomblob(16)))')
        .replace(/ON CONFLICT.*DO NOTHING/g, 'OR IGNORE');

      let result;
      
      if (sqliteQuery.toLowerCase().includes('select')) {
        const stmt = sqliteDb.prepare(sqliteQuery);
        result = { rows: stmt.all(params || []) };
      } else {
        const stmt = sqliteDb.prepare(sqliteQuery);
        const info = stmt.run(params || []);
        result = { rowCount: info.changes, rows: [] };
      }
      
      const duration = Date.now() - start;
      console.log('Executed SQLite query', { duration, rows: result.rows?.length || result.rowCount });
      return result;
    }
  } catch (error) {
    console.error('Query error', { text, error });
    throw error;
  }
};

// Initialize database connection
initializeDatabase().catch(console.error);

export { pool, sqliteDb };
export default pool;
