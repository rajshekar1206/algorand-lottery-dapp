export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface Ticket {
  id: string;
  user_id: string;
  draw_id: string;
  numbers: number[];
  purchase_date: Date;
  price: number;
  is_winner?: boolean;
}

export interface Draw {
  id: string;
  draw_date: Date;
  winning_numbers: number[] | null;
  status: 'scheduled' | 'active' | 'completed';
  total_prize: number;
  tickets_sold: number;
  created_at: Date;
}

export interface AuthRequest extends Express.Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
