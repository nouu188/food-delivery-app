import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '@backend/shared';
import { OtpType } from '@backend/shared';
import { JwtAuthGuard } from '@backend/common';
import { AUTH_PATTERNS } from '@backend/contracts';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @MessagePattern(AUTH_PATTERNS.REGISTER)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @MessagePattern(AUTH_PATTERNS.LOGIN)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @MessagePattern(AUTH_PATTERNS.LOGOUT)
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: any, @Body('refresh_token') refreshToken: string) {
    return this.authService.logout(req.user.id, refreshToken);
  }

  @Post('refresh-token')
  @MessagePattern(AUTH_PATTERNS.REFRESH_TOKEN)
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('forgot-password')
  @MessagePattern(AUTH_PATTERNS.FORGOT_PASSWORD)
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @MessagePattern(AUTH_PATTERNS.RESET_PASSWORD)
  async resetPassword(
    @Body('email') email: string,
    @Body('otp') otp: string,
    @Body('new_password') newPassword: string,
  ) {
    return this.authService.resetPassword(email, otp, newPassword);
  }

  @Post('verify-otp')
  @MessagePattern(AUTH_PATTERNS.VERIFY_OTP)
  async verifyOtp(
    @Body('identifier') identifier: string,
    @Body('otp') otp: string,
    @Body('type') type: OtpType,
  ) {
    return this.authService.verifyOtp(identifier, otp, type);
  }

  @Post('resend-otp')
  @MessagePattern(AUTH_PATTERNS.RESEND_OTP)
  async resendOtp(
    @Body('identifier') identifier: string,
    @Body('type') type: OtpType,
  ) {
    return this.authService.resendOtp(identifier, type);
  }
}
