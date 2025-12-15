import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '@backend/shared';
import { OtpType } from '@backend/shared';
import { JwtAuthGuard } from '@backend/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @MessagePattern('auth.register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @MessagePattern('auth.login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @MessagePattern('auth.logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: any, @Body('refresh_token') refreshToken: string) {
    return this.authService.logout(req.user.id, refreshToken);
  }

  @Post('refresh-token')
  @MessagePattern('auth.refresh-token')
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('forgot-password')
  @MessagePattern('auth.forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @MessagePattern('auth.reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('otp') otp: string,
    @Body('new_password') newPassword: string,
  ) {
    return this.authService.resetPassword(email, otp, newPassword);
  }

  @Post('verify-otp')
  @MessagePattern('auth.verify-otp')
  async verifyOtp(
    @Body('identifier') identifier: string,
    @Body('otp') otp: string,
    @Body('type') type: OtpType,
  ) {
    return this.authService.verifyOtp(identifier, otp, type);
  }

  @Post('resend-otp')
  @MessagePattern('auth.resend-otp')
  async resendOtp(
    @Body('identifier') identifier: string,
    @Body('type') type: OtpType,
  ) {
    return this.authService.resendOtp(identifier, type);
  }
}
