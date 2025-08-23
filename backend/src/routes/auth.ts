import express from 'express';
import { UserModel } from '../database/models.js';
import { AuthUtils } from '../utils/auth.js';
import { registerSchema, loginSchema } from '../utils/validation.js';
import { APIResponse } from '../types/index.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    
    if (!validation.success) {
      const response: APIResponse = {
        success: false,
        error: validation.error.errors[0].message
      };
      res.status(400).json(response);
      return;
    }

    const { email, password, firstName, lastName } = validation.data;

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      const response: APIResponse = {
        success: false,
        error: 'User with this email already exists'
      };
      res.status(409).json(response);
      return;
    }

    // Hash password and create user
    const passwordHash = await AuthUtils.hashPassword(password);
    const user = await UserModel.create({
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      role: 'user'
    });

    // Generate token
    const token = AuthUtils.generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    const response: APIResponse = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        },
        token
      },
      message: 'User registered successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    const response: APIResponse = {
      success: false,
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    
    if (!validation.success) {
      const response: APIResponse = {
        success: false,
        error: validation.error.errors[0].message
      };
      res.status(400).json(response);
      return;
    }

    const { email, password } = validation.data;

    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      const response: APIResponse = {
        success: false,
        error: 'Invalid email or password'
      };
      res.status(401).json(response);
      return;
    }

    // Verify password
    const isValidPassword = await AuthUtils.comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      const response: APIResponse = {
        success: false,
        error: 'Invalid email or password'
      };
      res.status(401).json(response);
      return;
    }

    // Generate token
    const token = AuthUtils.generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    const response: APIResponse = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        },
        token
      },
      message: 'Login successful'
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Login error:', error);
    const response: APIResponse = {
      success: false,
      error: 'Internal server error'
    };
    res.status(500).json(response);
  }
});

// Get current user profile
router.get('/me', async (req, res) => {
  // This will be protected by auth middleware when used
  const response: APIResponse = {
    success: true,
    data: { message: 'Profile endpoint - requires authentication middleware' }
  };
  res.json(response);
});

export default router;
