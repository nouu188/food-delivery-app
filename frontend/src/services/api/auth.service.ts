import apiClient from './client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutRequest
} from '@/types/api/auth';

class AuthService {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  }

  async logout(data: LogoutRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/logout', data);
    return response.data;
  }

  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await apiClient.post('/auth/refresh-token', data);
    return response.data;
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
  }

  async resendOtp(data: ResendOtpRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/resend-otp', data);
    return response.data;
  }
}

export default new AuthService();
