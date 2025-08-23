import { query } from './connection.js';
import { User, Ticket, Draw } from '../types/index.js';

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userData.email, userData.password_hash, userData.first_name, userData.last_name, userData.role]
    );
    return result.rows[0];
  }

  static async getAll(): Promise<User[]> {
    const result = await query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  }
}

export class DrawModel {
  static async getCurrent(): Promise<Draw | null> {
    const result = await query(
      `SELECT * FROM draws WHERE status IN ('scheduled', 'active') 
       ORDER BY draw_date ASC LIMIT 1`
    );
    return result.rows[0] || null;
  }

  static async getRecent(limit: number = 10): Promise<Draw[]> {
    const result = await query(
      'SELECT * FROM draws ORDER BY draw_date DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  }

  static async create(drawData: Omit<Draw, 'id' | 'created_at'>): Promise<Draw> {
    const result = await query(
      `INSERT INTO draws (draw_date, status, total_prize, tickets_sold) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [drawData.draw_date, drawData.status, drawData.total_prize, drawData.tickets_sold]
    );
    return result.rows[0];
  }

  static async updateWinningNumbers(drawId: string, numbers: number[]): Promise<Draw> {
    const result = await query(
      'UPDATE draws SET winning_numbers = $1, status = $2 WHERE id = $3 RETURNING *',
      [numbers, 'completed', drawId]
    );
    return result.rows[0];
  }
}

export class TicketModel {
  static async create(ticketData: Omit<Ticket, 'id' | 'purchase_date' | 'is_winner'>): Promise<Ticket> {
    const result = await query(
      `INSERT INTO tickets (user_id, draw_id, numbers, price) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [ticketData.user_id, ticketData.draw_id, ticketData.numbers, ticketData.price]
    );
    return result.rows[0];
  }

  static async getByUserId(userId: string): Promise<Ticket[]> {
    const result = await query(
      `SELECT t.*, d.draw_date, d.status, d.winning_numbers 
       FROM tickets t 
       JOIN draws d ON t.draw_id = d.id 
       WHERE t.user_id = $1 
       ORDER BY t.purchase_date DESC`,
      [userId]
    );
    return result.rows;
  }

  static async getByDrawId(drawId: string): Promise<Ticket[]> {
    const result = await query(
      'SELECT * FROM tickets WHERE draw_id = $1',
      [drawId]
    );
    return result.rows;
  }

  static async updateWinnerStatus(ticketId: string, isWinner: boolean): Promise<void> {
    await query(
      'UPDATE tickets SET is_winner = $1 WHERE id = $2',
      [isWinner, ticketId]
    );
  }
}
