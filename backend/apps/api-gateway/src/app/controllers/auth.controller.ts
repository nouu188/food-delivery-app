import { Controller, Post, Body, Inject, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard, AuthenticatedRequest } from '@backend/common';
import { AUTH_PATTERNS } from '@backend/contracts';
import { RegisterDto, LoginDto, OtpType } from '@backend/shared';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: ClientProxy) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return firstValueFrom(this.authService.send(AUTH_PATTERNS.REGISTER, registerDto));
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return firstValueFrom(this.authService.send(AUTH_PATTERNS.LOGIN, loginDto));
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: AuthenticatedRequest, @Body('refresh_token') refreshToken: string) {
    return firstValueFrom(
      this.authService.send(AUTH_PATTERNS.LOGOUT, {
        userId: req.user.id,
        refreshToken,
      })
    );
  }

  @Post('refresh-token')
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    return firstValueFrom(
      this.authService.send(AUTH_PATTERNS.REFRESH_TOKEN, { refreshToken })
    );
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return firstValueFrom(this.authService.send(AUTH_PATTERNS.FORGOT_PASSWORD, { email }));
  }

  @Post('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('otp') otp: string,
    @Body('new_password') newPassword: string
  ) {
    return firstValueFrom(
      this.authService.send(AUTH_PATTERNS.RESET_PASSWORD, {
        email,
        otp,
        newPassword,
      })
    );
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body('identifier') identifier: string,
    @Body('otp') otp: string,
    @Body('type') type: OtpType
  ) {
    return firstValueFrom(
      this.authService.send(AUTH_PATTERNS.VERIFY_OTP, {
        identifier,
        otp,
        type,
      })
    );
  }

  @Post('resend-otp')
  async resendOtp(@Body('identifier') identifier: string, @Body('type') type: OtpType) {
    return firstValueFrom(
      this.authService.send(AUTH_PATTERNS.RESEND_OTP, {
        identifier,
        type,
      })
    );
  }
}
