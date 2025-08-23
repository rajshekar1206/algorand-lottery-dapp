import express from 'express';
import { LotteryService } from '../services/lottery.js';
import { TicketModel, DrawModel } from '../database/models.js';
import { authenticateToken, requireUser } from '../middleware/auth.js';
import { ticketPurchaseSchema } from '../utils/validation.js';
import { APIResponse, AuthRequest } from '../types/index.js';

const router = express.Router();

// Get current draw
router.get('/current-draw', async (req, res) => {
  try {
    const draw = await LotteryService.getCurrentDraw();
    
    const response: APIResponse = {
      success: true,
      data: draw,
      message: draw ? 'Current draw retrieved' : 'No active draw'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error getting current draw:', error);
    const response: APIResponse = {
      success: false,
      error: 'Failed to get current draw'
    };
    res.status(500).json(response);
  }
});

// Get recent draws
router.get('/draws', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const draws = await LotteryService.getRecentDraws(limit);
    
    const response: APIResponse = {
      success: true,
      data: draws,
      message: 'Recent draws retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error getting draws:', error);
    const response: APIResponse = {
      success: false,
      error: 'Failed to get draws'
    };
    res.status(500).json(response);
  }
});

// Purchase ticket (requires authentication)
router.post('/purchase-ticket', authenticateToken, requireUser, async (req: AuthRequest, res) => {
  try {
    const validation = ticketPurchaseSchema.safeParse(req.body);
    
    if (!validation.success) {
      const response: APIResponse = {
        success: false,
        error: validation.error.errors[0].message
      };
      res.status(400).json(response);
      return;
    }

    const { drawId, numbers } = validation.data;
    const userId = req.user!.id;

    const ticket = await LotteryService.purchaseTicket(userId, drawId, numbers);
    
    const response: APIResponse = {
      success: true,
      data: ticket,
      message: 'Ticket purchased successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error purchasing ticket:', error);
    
    let errorMessage = 'Failed to purchase ticket';
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

// Get user's tickets (requires authentication)
router.get('/my-tickets', authenticateToken, requireUser, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const tickets = await TicketModel.getByUserId(userId);
    
    const response: APIResponse = {
      success: true,
      data: tickets,
      message: 'User tickets retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error getting user tickets:', error);
    const response: APIResponse = {
      success: false,
      error: 'Failed to get user tickets'
    };
    res.status(500).json(response);
  }
});

// Generate quick pick numbers
router.get('/quick-pick', (req, res) => {
  try {
    const numbers = LotteryService.generateQuickPick();
    
    const response: APIResponse = {
      success: true,
      data: { numbers },
      message: 'Quick pick numbers generated'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error generating quick pick:', error);
    const response: APIResponse = {
      success: false,
      error: 'Failed to generate quick pick numbers'
    };
    res.status(500).json(response);
  }
});

// Get lottery statistics
router.get('/statistics', async (req, res) => {
  try {
    const stats = await LotteryService.getStatistics();
    
    const response: APIResponse = {
      success: true,
      data: stats,
      message: 'Statistics retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error getting statistics:', error);
    const response: APIResponse = {
      success: false,
      error: 'Failed to get statistics'
    };
    res.status(500).json(response);
  }
});

// Get draw details by ID
router.get('/draw/:id', async (req, res) => {
  try {
    const drawId = req.params.id;
    
    // Get draw details and tickets
    const [tickets] = await Promise.all([
      TicketModel.getByDrawId(drawId)
    ]);
    
    // Get draw by checking recent draws
    const recentDraws = await DrawModel.getRecent(50);
    const draw = recentDraws.find(d => d.id === drawId);
    
    if (!draw) {
      const response: APIResponse = {
        success: false,
        error: 'Draw not found'
      };
      res.status(404).json(response);
      return;
    }
    
    const response: APIResponse = {
      success: true,
      data: {
        draw,
        ticketCount: tickets.length,
        winningTickets: tickets.filter(t => t.is_winner).length
      },
      message: 'Draw details retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error getting draw details:', error);
    const response: APIResponse = {
      success: false,
      error: 'Failed to get draw details'
    };
    res.status(500).json(response);
  }
});

export default router;
