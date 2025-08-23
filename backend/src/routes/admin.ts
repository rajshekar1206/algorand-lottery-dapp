import express from 'express';
import { LotteryService } from '../services/lottery.js';
import { UserModel, DrawModel, TicketModel } from '../database/models.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { createDrawSchema } from '../utils/validation.js';
import { APIResponse, AuthRequest } from '../types/index.js';

const router = express.Router();

// Apply authentication and admin requirement to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Get all users
router.get('/users', async (req: AuthRequest, res) => {
  try {
    const users = await UserModel.getAll();
    
    // Remove password hashes from response
    const safeUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }));
    
    const response: APIResponse = {
      success: true,
      data: safeUsers,
      message: 'Users retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error getting users:', error);
    const response: APIResponse = {
      success: false,
      error: 'Failed to get users'
    };
    res.status(500).json(response);
  }
});

// Create a new draw
router.post('/draws', async (req: AuthRequest, res) => {
  try {
    const validation = createDrawSchema.safeParse(req.body);
    
    if (!validation.success) {
      const response: APIResponse = {
        success: false,
        error: validation.error.errors[0].message
      };
      res.status(400).json(response);
      return;
    }

    const { drawDate, totalPrize } = validation.data;
    const draw = await LotteryService.createDraw(new Date(drawDate), totalPrize);
    
    const response: APIResponse = {
      success: true,
      data: draw,
      message: 'Draw created successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating draw:', error);
    
    let errorMessage = 'Failed to create draw';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    const response: APIResponse = {
      success: false,
      error: errorMessage
    };
    res.status(400).json(response);
  }
});

// Conduct a draw
router.post('/draws/:id/conduct', async (req: AuthRequest, res) => {
  try {
    const drawId = req.params.id;
    const result = await LotteryService.conductDraw(drawId);
    
    const response: APIResponse = {
      success: true,
      data: {
        draw: result.draw,
        winnersCount: result.winners.length,
        winners: result.winners
      },
      message: 'Draw conducted successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error conducting draw:', error);
    
    let errorMessage = 'Failed to conduct draw';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    const response: APIResponse = {
      success: false,
      error: errorMessage
    };
    res.status(400).json(response);
  }
});

// Schedule next draw automatically
router.post('/draws/schedule-next', async (req: AuthRequest, res) => {
  try {
    const draw = await LotteryService.scheduleNextDraw();
    
    const response: APIResponse = {
      success: true,
      data: draw,
      message: 'Next draw scheduled successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error scheduling next draw:', error);
    const response: APIResponse = {
      success: false,
      error: 'Failed to schedule next draw'
    };
    res.status(500).json(response);
  }
});

// Get all draws (admin view with more details)
router.get('/draws', async (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const draws = await DrawModel.getRecent(limit);
    
    // Get ticket counts for each draw
    const drawsWithDetails = await Promise.all(
      draws.map(async (draw) => {
        const tickets = await TicketModel.getByDrawId(draw.id);
        return {
          ...draw,
          ticketCount: tickets.length,
          winningTickets: tickets.filter(t => t.is_winner).length
        };
      })
    );
    
    const response: APIResponse = {
      success: true,
      data: drawsWithDetails,
      message: 'Admin draws retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error getting admin draws:', error);
    const response: APIResponse = {
      success: false,
      error: 'Failed to get draws'
    };
    res.status(500).json(response);
  }
});

// Get draw tickets (admin only)
router.get('/draws/:id/tickets', async (req: AuthRequest, res) => {
  try {
    const drawId = req.params.id;
    const tickets = await TicketModel.getByDrawId(drawId);
    
    const response: APIResponse = {
      success: true,
      data: tickets,
      message: 'Draw tickets retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error getting draw tickets:', error);
    const response: APIResponse = {
      success: false,
      error: 'Failed to get draw tickets'
    };
    res.status(500).json(response);
  }
});

// Dashboard statistics
router.get('/dashboard', async (req: AuthRequest, res) => {
  try {
    const [users, recentDraws, stats] = await Promise.all([
      UserModel.getAll(),
      DrawModel.getRecent(10),
      LotteryService.getStatistics()
    ]);
    
    const currentDraw = await LotteryService.getCurrentDraw();
    let currentDrawTickets = 0;
    
    if (currentDraw) {
      const tickets = await TicketModel.getByDrawId(currentDraw.id);
      currentDrawTickets = tickets.length;
    }
    
    const dashboard = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.role === 'user').length,
      totalDraws: stats.totalDraws,
      currentDraw: currentDraw ? {
        ...currentDraw,
        ticketsSold: currentDrawTickets
      } : null,
      recentDraws: recentDraws.slice(0, 5),
      statistics: stats
    };
    
    const response: APIResponse = {
      success: true,
      data: dashboard,
      message: 'Admin dashboard data retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    const response: APIResponse = {
      success: false,
      error: 'Failed to get dashboard data'
    };
    res.status(500).json(response);
  }
});

export default router;
