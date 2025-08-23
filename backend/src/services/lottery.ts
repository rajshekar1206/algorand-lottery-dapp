import { DrawModel, TicketModel } from '../database/models.js';
import LotterySDK from '../utils/lottery-sdk.js';
import { config } from '../config/env.js';
import { Draw, Ticket } from '../types/index.js';

export class LotteryService {
  /**
   * Create a new lottery draw
   */
  static async createDraw(drawDate: Date, totalPrize: number): Promise<Draw> {
    if (!LotterySDK.validateDrawParameters(drawDate, totalPrize)) {
      throw new Error('Invalid draw parameters');
    }

    const draw = await DrawModel.create({
      draw_date: drawDate,
      winning_numbers: null,
      status: 'scheduled',
      total_prize: totalPrize,
      tickets_sold: 0
    });

    return draw;
  }

  /**
   * Purchase a lottery ticket
   */
  static async purchaseTicket(
    userId: string,
    drawId: string,
    numbers: number[]
  ): Promise<Ticket> {
    // Validate numbers
    if (!LotterySDK.validateTicketNumbers(numbers)) {
      throw new Error('Invalid lottery numbers');
    }

    // Check if draw exists and is available for ticket purchases
    const draw = await DrawModel.getCurrent();
    if (!draw || draw.id !== drawId) {
      throw new Error('Draw not available for ticket purchases');
    }

    if (draw.status !== 'scheduled' && draw.status !== 'active') {
      throw new Error('Draw is no longer accepting tickets');
    }

    // Check user's existing tickets for this draw
    const userTickets = await TicketModel.getByUserId(userId);
    const ticketsForDraw = userTickets.filter(ticket => ticket.draw_id === drawId);
    
    if (ticketsForDraw.length >= config.lottery.maxTicketsPerUser) {
      throw new Error(`Maximum ${config.lottery.maxTicketsPerUser} tickets per draw exceeded`);
    }

    // Create ticket
    const ticket = await TicketModel.create({
      user_id: userId,
      draw_id: drawId,
      numbers,
      price: config.lottery.ticketPrice
    });

    return ticket;
  }

  /**
   * Conduct a lottery draw
   */
  static async conductDraw(drawId: string): Promise<{
    draw: Draw;
    winners: Array<{ ticket: Ticket; validation: any }>;
  }> {
    // Get the draw
    const draw = await DrawModel.getCurrent();
    if (!draw || draw.id !== drawId) {
      throw new Error('Draw not found');
    }

    if (draw.status === 'completed') {
      throw new Error('Draw already completed');
    }

    // Generate winning numbers
    const result = LotterySDK.conductDraw(drawId, draw.total_prize);
    
    // Update draw with winning numbers
    const updatedDraw = await DrawModel.updateWinningNumbers(
      drawId, 
      result.winningNumbers
    );

    // Get all tickets for this draw
    const tickets = await TicketModel.getByDrawId(drawId);
    
    // Validate winners
    const winners: Array<{ ticket: Ticket; validation: any }> = [];
    
    for (const ticket of tickets) {
      const validation = LotterySDK.validateWinner(
        ticket.numbers,
        result.winningNumbers,
        draw.total_prize
      );

      if (validation.isWinner) {
        await TicketModel.updateWinnerStatus(ticket.id, true);
        winners.push({ ticket, validation });
      }
    }

    return { draw: updatedDraw, winners };
  }

  /**
   * Get lottery statistics
   */
  static async getStatistics(): Promise<{
    totalDraws: number;
    totalTicketsSold: number;
    totalPrizesAwarded: number;
    odds: Record<string, string>;
  }> {
    const recentDraws = await DrawModel.getRecent(100);
    
    const totalDraws = recentDraws.length;
    const totalTicketsSold = recentDraws.reduce((sum, draw) => sum + draw.tickets_sold, 0);
    const totalPrizesAwarded = recentDraws
      .filter(draw => draw.status === 'completed')
      .reduce((sum, draw) => sum + draw.total_prize, 0);

    const odds = LotterySDK.getOdds();

    return {
      totalDraws,
      totalTicketsSold,
      totalPrizesAwarded,
      odds
    };
  }

  /**
   * Generate quick pick numbers for a user
   */
  static generateQuickPick(): number[] {
    return LotterySDK.generateQuickPick();
  }

  /**
   * Get current draw information
   */
  static async getCurrentDraw(): Promise<Draw | null> {
    return DrawModel.getCurrent();
  }

  /**
   * Get recent draws
   */
  static async getRecentDraws(limit: number = 10): Promise<Draw[]> {
    return DrawModel.getRecent(limit);
  }

  /**
   * Schedule next draw automatically
   */
  static async scheduleNextDraw(): Promise<Draw> {
    const now = new Date();
    const nextDrawDate = new Date(now);
    
    // Schedule for next day at 8 PM
    nextDrawDate.setDate(nextDrawDate.getDate() + 1);
    nextDrawDate.setHours(20, 0, 0, 0);

    const basePrize = 100000; // $100,000 base prize
    
    return this.createDraw(nextDrawDate, basePrize);
  }
}

export default LotteryService;
