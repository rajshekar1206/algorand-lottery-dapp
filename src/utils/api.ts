import type { ApiResponse, User, LoginData, RegisterData } from '../types';
import {
  mockCurrentDraw,
  mockRecentDraws,
  mockStatistics,
  mockUserTickets,
  mockAdminDashboard,
  mockUsers
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true' || false;

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: this.getAuthHeaders(),
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);

      // Check if it's a connection error
      if (error instanceof Error && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Backend server is not running. Please start the backend server on port 3001.'
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  // Auth endpoints
  async login(loginData: LoginData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData)
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async register(registerData: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData)
    });

    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/me');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Lottery endpoints
  async getCurrentDraw(): Promise<ApiResponse<any>> {
    if (DEMO_MODE) {
      return {
        success: true,
        data: mockCurrentDraw,
        message: 'Demo data - Backend not connected'
      };
    }

    const result = await this.request('/lottery/current-draw');
    if (!result.success && result.error?.includes('Backend server is not running')) {
      return {
        success: true,
        data: mockCurrentDraw,
        message: 'Demo data - Backend not connected'
      };
    }
    return result;
  }

  async getRecentDraws(limit: number = 10): Promise<ApiResponse<any[]>> {
    if (DEMO_MODE) {
      return {
        success: true,
        data: mockRecentDraws.slice(0, limit),
        message: 'Demo data - Backend not connected'
      };
    }

    const result = await this.request(`/lottery/draws?limit=${limit}`);
    if (!result.success && result.error?.includes('Backend server is not running')) {
      return {
        success: true,
        data: mockRecentDraws.slice(0, limit),
        message: 'Demo data - Backend not connected'
      };
    }
    return result;
  }

  async purchaseTicket(drawId: string, numbers: number[]): Promise<ApiResponse<any>> {
    if (DEMO_MODE) {
      return {
        success: false,
        error: 'Demo mode: Ticket purchasing requires backend connection. Please start the backend server to purchase real tickets.'
      };
    }

    const result = await this.request('/lottery/purchase-ticket', {
      method: 'POST',
      body: JSON.stringify({ drawId, numbers })
    });

    if (!result.success && result.error?.includes('Backend server is not running')) {
      return {
        success: false,
        error: 'Backend server required: Please start the backend server to purchase lottery tickets.'
      };
    }

    return result;
  }

  async getMyTickets(): Promise<ApiResponse<any[]>> {
    if (DEMO_MODE) {
      return {
        success: true,
        data: mockUserTickets,
        message: 'Demo data - Backend not connected'
      };
    }

    const result = await this.request('/lottery/my-tickets');
    if (!result.success && result.error?.includes('Backend server is not running')) {
      // Only show tickets in demo if user is "logged in"
      const user = this.getCurrentUser();
      return {
        success: true,
        data: user ? mockUserTickets : [],
        message: 'Demo data - Backend not connected'
      };
    }
    return result;
  }

  async generateQuickPick(): Promise<ApiResponse<{ numbers: number[] }>> {
    if (DEMO_MODE) {
      const numbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 50) + 1)
        .filter((num, index, arr) => arr.indexOf(num) === index)
        .slice(0, 6);

      // Fill remaining slots if we have duplicates
      while (numbers.length < 6) {
        const num = Math.floor(Math.random() * 50) + 1;
        if (!numbers.includes(num)) {
          numbers.push(num);
        }
      }

      return {
        success: true,
        data: { numbers: numbers.sort((a, b) => a - b) },
        message: 'Demo quick pick generated'
      };
    }

    const result = await this.request('/lottery/quick-pick');
    if (!result.success && result.error?.includes('Backend server is not running')) {
      const numbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 50) + 1)
        .filter((num, index, arr) => arr.indexOf(num) === index)
        .slice(0, 6);

      while (numbers.length < 6) {
        const num = Math.floor(Math.random() * 50) + 1;
        if (!numbers.includes(num)) {
          numbers.push(num);
        }
      }

      return {
        success: true,
        data: { numbers: numbers.sort((a, b) => a - b) },
        message: 'Demo quick pick generated'
      };
    }
    return result;
  }

  async getStatistics(): Promise<ApiResponse<any>> {
    if (DEMO_MODE) {
      return {
        success: true,
        data: mockStatistics,
        message: 'Demo data - Backend not connected'
      };
    }

    const result = await this.request('/lottery/statistics');
    if (!result.success && result.error?.includes('Backend server is not running')) {
      return {
        success: true,
        data: mockStatistics,
        message: 'Demo data - Backend not connected'
      };
    }
    return result;
  }

  // Admin endpoints
  async getAdminDashboard(): Promise<ApiResponse<any>> {
    if (DEMO_MODE) {
      return {
        success: true,
        data: mockAdminDashboard,
        message: 'Demo data - Backend not connected'
      };
    }

    const result = await this.request('/admin/dashboard');
    if (!result.success && result.error?.includes('Backend server is not running')) {
      return {
        success: true,
        data: mockAdminDashboard,
        message: 'Demo data - Backend not connected'
      };
    }
    return result;
  }

  async getAllUsers(): Promise<ApiResponse<User[]>> {
    if (DEMO_MODE) {
      return {
        success: true,
        data: mockUsers,
        message: 'Demo data - Backend not connected'
      };
    }

    const result = await this.request('/admin/users');
    if (!result.success && result.error?.includes('Backend server is not running')) {
      return {
        success: true,
        data: mockUsers,
        message: 'Demo data - Backend not connected'
      };
    }
    return result;
  }

  async createDraw(drawDate: string, totalPrize: number): Promise<ApiResponse<any>> {
    return this.request('/admin/draws', {
      method: 'POST',
      body: JSON.stringify({ drawDate, totalPrize })
    });
  }

  async conductDraw(drawId: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/draws/${drawId}/conduct`, {
      method: 'POST'
    });
  }

  async scheduleNextDraw(): Promise<ApiResponse<any>> {
    return this.request('/admin/draws/schedule-next', {
      method: 'POST'
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}

export const apiClient = new ApiClient();
export default apiClient;

// Re-export types for backward compatibility
export type { ApiResponse, User, LoginData, RegisterData } from '../types';
