import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth.js';
import lotteryRoutes from './routes/lottery.js';
import adminRoutes from './routes/admin.js';

// Import middleware
import { authenticateToken, requireUser } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Lottery API Server Running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      lottery: '/api/lottery',
      admin: '/api/admin'
    }
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/lottery', lotteryRoutes);
app.use('/api/admin', adminRoutes);

// Protected profile route example
app.get('/api/auth/me', authenticateToken, requireUser, async (req: any, res) => {
  try {
    const response = {
      success: true,
      data: {
        user: req.user
      },
      message: 'Profile retrieved successfully'
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API Documentation available at http://localhost:${PORT}/api`);
});

export default app;
