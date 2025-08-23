import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100)
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export const ticketPurchaseSchema = z.object({
  drawId: z.string().uuid('Invalid draw ID'),
  numbers: z.array(z.number().int().min(1).max(50))
    .length(6, 'Must select exactly 6 numbers')
    .refine((numbers) => {
      const unique = new Set(numbers);
      return unique.size === numbers.length;
    }, 'Numbers must be unique')
});

export const createDrawSchema = z.object({
  drawDate: z.string().datetime('Invalid date format'),
  totalPrize: z.number().positive('Prize must be positive')
});

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type TicketPurchaseData = z.infer<typeof ticketPurchaseSchema>;
export type CreateDrawData = z.infer<typeof createDrawSchema>;
