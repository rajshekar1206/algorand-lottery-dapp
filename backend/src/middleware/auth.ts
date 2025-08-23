import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../utils/auth.js';
import { UserModel } from '../database/models.js';
import { AuthRequest } from '../types/index.js';

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = AuthUtils.extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      res.status(401).json({ success: false, error: 'Access token required' });
      return;
    }

    const payload = AuthUtils.verifyToken(token);
    
    // Verify user still exists
    const user = await UserModel.findById(payload.id);
    if (!user) {
      res.status(401).json({ success: false, error: 'User not found' });
      return;
    }

    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role
    };

    next();
  } catch (error) {
    res.status(403).json({ success: false, error: 'Invalid or expired token' });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Admin access required' });
    return;
  }

  next();
};

export const requireUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  next();
};
