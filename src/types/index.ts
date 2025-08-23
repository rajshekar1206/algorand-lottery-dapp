export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface Draw {
  id: string;
  draw_date: string;
  winning_numbers: number[] | null;
  status: 'scheduled' | 'active' | 'completed';
  total_prize: number;
  tickets_sold: number;
  created_at: string;
}

export interface Ticket {
  id: string;
  user_id: string;
  draw_id: string;
  numbers: number[];
  purchase_date: string;
  price: number;
  is_winner?: boolean;
}
