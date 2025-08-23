// SQLite fallback for demo purposes
import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function setupSQLiteDemo() {
  const db = new Database(':memory:');
  
  // Convert PostgreSQL schema to SQLite
  const sqliteSchema = `
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Draws table
    CREATE TABLE IF NOT EXISTS draws (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        draw_date DATETIME NOT NULL,
        winning_numbers TEXT DEFAULT NULL,
        status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed')),
        total_prize DECIMAL(10,2) DEFAULT 0,
        tickets_sold INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tickets table
    CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        draw_id TEXT NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
        numbers TEXT NOT NULL,
        purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        price DECIMAL(10,2) NOT NULL,
        is_winner BOOLEAN DEFAULT FALSE
    );

    -- Insert default admin user (password: admin123)
    INSERT OR IGNORE INTO users (id, email, password_hash, first_name, last_name, role) 
    VALUES (
        'admin-user-id', 
        'admin@lottery.com', 
        '$2b$10$rQJzTg8mB7NfG5yKLLYoO.8QvQWZNOJfJ0KzG3xjKzDzNnYxY3LJy', 
        'Admin', 
        'User', 
        'admin'
    );

    -- Insert sample draw
    INSERT OR IGNORE INTO draws (id, draw_date, status, total_prize, tickets_sold)
    VALUES (
        'sample-draw-1',
        datetime('now', '+1 day'),
        'scheduled',
        1500000,
        0
    );
  `;

  db.exec(sqliteSchema);
  return db;
}
