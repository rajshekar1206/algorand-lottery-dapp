import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/lottery_db'
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  lottery: {
    ticketPrice: parseFloat(process.env.TICKET_PRICE || '5.00'),
    drawFrequency: process.env.DRAW_FREQUENCY || 'daily',
    maxTicketsPerUser: parseInt(process.env.MAX_TICKETS_PER_USER || '10')
  }
};
