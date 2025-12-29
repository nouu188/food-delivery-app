import { Controller, Post, Body, Inject, UseGuards, Request, HttpStatus, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, catchError, throwError } from 'rxjs';
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
  SendOtpDto,
} from '@backend/shared';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: ClientProxy) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await firstValueFrom(
        this.authService.send(
          AUTH_PATTERNS.REGISTER,
          registerDto,
        ),
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 409) {
        throw new HttpException(
          errorData.message || 'User already exists',
          HttpStatus.CONFLICT,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid registration data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Registration failed',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal authentication error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await firstValueFrom(
        this.authService.send(AUTH_PATTERNS.LOGIN, loginDto),
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 401) {
        throw new HttpException(
          errorData.message || 'Invalid credentials',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid login data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Login failed',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal authentication error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
    try {
      return await firstValueFrom(
        this.authService.send(
          AUTH_PATTERNS.REFRESH_TOKEN,
          { refreshToken: body.refresh_token },
        ),
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 401) {
        throw new HttpException(
          errorData.message || 'Invalid or expired refresh token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid refresh token payload',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to refresh token',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal authentication error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    try {
      return await firstValueFrom(
        this.authService.send(
          AUTH_PATTERNS.FORGOT_PASSWORD,
          { email: body.email },
        ),
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid email',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to process forgot password',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal authentication error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    try {
      return await firstValueFrom(
        this.authService.send(
          AUTH_PATTERNS.RESET_PASSWORD,
          {
            email: body.email,
            otp: body.otp,
            newPassword: body.new_password,
          },
        ),
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid or expired OTP',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to reset password',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal authentication error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    try {
      return await firstValueFrom(
        this.authService.send(
          AUTH_PATTERNS.VERIFY_OTP,
          {
            identifier: body.identifier,
            otp: body.otp,
            type: body.type,
          },
        ),
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid or expired OTP',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to verify OTP',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal authentication error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
