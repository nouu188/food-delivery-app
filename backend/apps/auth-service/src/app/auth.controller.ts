import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  LogoutDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyOtpDto,
  SendOtpDto,
  OtpType
} from '@backend/shared';
import { AUTH_PATTERNS } from '@backend/contracts';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/health')
  getHealth() {
    return {
      status: 'ok',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
    };
  }

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  async register(registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  async login(loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessagePattern(AUTH_PATTERNS.LOGOUT)
  async logout(data: { userId: string; refreshToken: string }) {
    return this.authService.logout(data.userId, data.refreshToken);
  }

  @MessagePattern(AUTH_PATTERNS.REFRESH_TOKEN)
  async refreshToken(data: { refreshToken: string }) {
    return this.authService.refreshToken(data.refreshToken);
  }

  @MessagePattern(AUTH_PATTERNS.FORGOT_PASSWORD)
  async forgotPassword(data: { email: string }) {
    return this.authService.forgotPassword(data.email);
  }

  @MessagePattern(AUTH_PATTERNS.RESET_PASSWORD)
  async resetPassword(data: { email: string; otp: string; newPassword: string }) {
    return this.authService.resetPassword(data.email, data.otp, data.newPassword);
  }

  @MessagePattern(AUTH_PATTERNS.VERIFY_OTP)
  async verifyOtp(data: { identifier: string; otp: string; type: OtpType }) {
    return this.authService.verifyOtp(data.identifier, data.otp, data.type);
  }

  @MessagePattern(AUTH_PATTERNS.RESEND_OTP)
  async resendOtp(data: { identifier: string; type: OtpType }) {
    return this.authService.resendOtp(data.identifier, data.type);
  }
}
