import { Controller, Post, Body, Inject, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard, AuthenticatedRequest } from '@backend/common';
import { AUTH_PATTERNS } from '@backend/contracts';
import {
  RegisterDto,
  LoginDto,
  LogoutDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyOtpDto,
  SendOtpDto
} from '@backend/shared';

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
  async logout(@Request() req: AuthenticatedRequest, @Body() body: LogoutDto) {
    return firstValueFrom(
      this.authService.send(AUTH_PATTERNS.LOGOUT, {
        userId: req.user.id,
        refreshToken: body.refresh_token,
      })
    );
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto) {
    return firstValueFrom(
      this.authService.send(AUTH_PATTERNS.REFRESH_TOKEN, { refreshToken: body.refresh_token })
    );
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return firstValueFrom(this.authService.send(AUTH_PATTERNS.FORGOT_PASSWORD, { email: body.email }));
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return firstValueFrom(
      this.authService.send(AUTH_PATTERNS.RESET_PASSWORD, {
        email: body.email,
        otp: body.otp,
        newPassword: body.new_password,
      })
    );
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return firstValueFrom(
      this.authService.send(AUTH_PATTERNS.VERIFY_OTP, {
        identifier: body.identifier,
        otp: body.otp,
        type: body.type,
      })
    );
  }

  @Post('resend-otp')
  async resendOtp(@Body() body: SendOtpDto) {
    return firstValueFrom(
      this.authService.send(AUTH_PATTERNS.RESEND_OTP, {
        identifier: body.identifier,
        type: body.type,
      })
    );
  }
}
