import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full name is too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    ),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Phone must be 10 digits')
    .optional()
    .or(z.literal('')),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^[0-9]{6}$/, 'OTP must be numeric'),
  new_password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^[0-9]{6}$/, 'OTP must be numeric'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
