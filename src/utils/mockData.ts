// Mock data for demo mode when backend is not available

export const mockCurrentDraw = {
  id: "demo-draw-1",
  draw_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
  winning_numbers: null,
  status: "scheduled",
  total_prize: 1500000,
  tickets_sold: 0,
  created_at: new Date().toISOString()
};

export const mockRecentDraws = [
  {
    id: "demo-draw-2",
    draw_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    winning_numbers: [7, 14, 23, 31, 42, 49],
    status: "completed",
    total_prize: 1200000,
    tickets_sold: 2500,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "demo-draw-3",
    draw_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last week
    winning_numbers: [3, 17, 29, 35, 41, 46],
    status: "completed",
    total_prize: 800000,
    tickets_sold: 1800,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "demo-draw-4",
    draw_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // Two weeks ago
    winning_numbers: [5, 12, 28, 33, 39, 47],
    status: "completed",
    total_prize: 950000,
    tickets_sold: 2100,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const mockStatistics = {
  totalDraws: 156,
  totalTicketsSold: 45230,
  totalPrizesAwarded: 89450000,
  odds: {
    jackpot: "1 in 15,890,700",
    second: "1 in 2,648,450",
    third: "1 in 529,690",
    fourth: "1 in 79,454"
  }
};

export const mockUserTickets = [
  {
    id: "demo-ticket-1",
    user_id: "demo-user",
    draw_id: "demo-draw-2",
    numbers: [7, 14, 23, 31, 42, 50], // 5 matches
    purchase_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    price: 5.00,
    is_winner: true,
    draw_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    winning_numbers: [7, 14, 23, 31, 42, 49]
  },
  {
    id: "demo-ticket-2",
    user_id: "demo-user",
    draw_id: "demo-draw-3",
    numbers: [1, 15, 22, 30, 38, 44],
    purchase_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    price: 5.00,
    is_winner: false,
    draw_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    winning_numbers: [3, 17, 29, 35, 41, 46]
  }
];

export const mockAdminDashboard = {
  totalUsers: 1247,
  activeUsers: 1180,
  totalDraws: 156,
  currentDraw: {
    ...mockCurrentDraw,
    ticketsSold: 0
  },
  recentDraws: mockRecentDraws.slice(0, 5),
  statistics: mockStatistics
};

export const mockUsers = [
  {
    id: "demo-user-1",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "user",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "demo-user-2",
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    role: "user",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "demo-admin",
    email: "admin@lottery.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  }
];
