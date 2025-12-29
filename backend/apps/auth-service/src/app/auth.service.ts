import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, RefreshToken } from '@backend/database';
import { RegisterDto, LoginDto, RegisterResponseDto } from '@backend/shared';
import { OtpType, UserStatus } from '@backend/shared';
import { RpcException } from '@nestjs/microservices';
import { EmailService } from './services/email.service';
import { RedisService } from './services/redis.service';

interface OtpData {
  otpHash: string;
  attempts: number;
  createdAt: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService
  ) {}

  private readonly logger = new Logger('AuthService');
  private readonly OTP_TTL_SECONDS = 600; // 10 minutes
  private readonly MAX_OTP_ATTEMPTS = 3;

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: [{ email: registerDto.email }, { phone: registerDto.phone }],
      });

      if (existingUser) {
        throw new ConflictException('User with this email or phone already exists')
      }

      if (!registerDto.password) {
        throw new InternalServerErrorException('Password is required')
      }
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const user = this.userRepository.create({
        email: registerDto.email,
        phone: registerDto.phone,
        password_hash: hashedPassword,
        full_name: registerDto.full_name,
        role: registerDto.role || undefined,
      });

      const savedUser = await this.userRepository.save(user);

      return {
        id: savedUser.id,
        email: savedUser.email,
        full_name: savedUser.full_name,
        role: savedUser.role,
        status: savedUser.status,
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`, error.stack);

      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Internal Server Error during registration',
      });
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email },
      });

      if (!user) {
        throw new RpcException({
          statusCode: 401,
          message: 'Invalid credentials',
        });
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password_hash
      );

      if (!isPasswordValid) {
        throw new RpcException({
          statusCode: 401,
          message: 'Invalid credentials',
        });
      }

      if (
        user.status !== UserStatus.ACTIVE &&
        user.status !== UserStatus.PENDING_VERIFICATION
      ) {
        throw new RpcException({
          statusCode: 401,
          message: 'Account is suspended or inactive',
        });
      }

      user.last_login_at = new Date();
      await this.userRepository.save(user);

      const tokens = await this.generateTokens(user);

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          status: user.status,
        },
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`, error.stack);

      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        statusCode: error.status || 500,
        message: error.message || 'Internal Server Error during login',
      });
    }
  }

  async logout(userId: string, refreshToken: string) {
    await this.refreshTokenRepository.update(
      { user_id: userId, token_hash: await bcrypt.hash(refreshToken, 10) },
      { is_revoked: true }
    );

    return { message: 'Logged out successfully' };
  }

  async refreshToken(refreshToken: string) {
    const decoded = this.jwtService.verify(refreshToken, {
      secret:
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'your-refresh-secret',
    });

    const storedTokens = await this.refreshTokenRepository.find({
      where: { user_id: decoded.sub, is_revoked: false },
    });

    if (!storedTokens || storedTokens.length === 0) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    let validToken = null;
    for (const token of storedTokens) {
      const isValid = await bcrypt.compare(refreshToken, token.token_hash);
      if (isValid) {
        validToken = token;
        break;
      }
    }

    if (!validToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (validToken.expires_at < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.userRepository.findOne({
      where: { id: decoded.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const tokens = await this.generateTokens(user);

    await this.refreshTokenRepository.update(
      { id: validToken.id },
      { is_revoked: true }
    );

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return { message: 'If email exists, OTP has been sent' };
    }

    const otp = this.generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    await this.saveOtpData(email, OtpType.PASSWORD_RESET, {
      otpHash,
      attempts: 0,
      createdAt: new Date().toISOString(),
    });

    try {
      await this.emailService.sendOtpEmail(email, otp, 'password-reset');
      this.logger.log(`Password reset OTP sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset OTP to ${email}:`, error);
    }

    return { message: 'If email exists, OTP has been sent' };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const otpData = await this.getOtpData(email, OtpType.PASSWORD_RESET);

    if (!otpData) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (otpData.attempts >= this.MAX_OTP_ATTEMPTS) {
      throw new BadRequestException('Maximum OTP attempts exceeded');
    }

    const isOtpValid = await bcrypt.compare(otp, otpData.otpHash);

    if (!isOtpValid) {
      otpData.attempts += 1;
      await this.saveOtpData(email, OtpType.PASSWORD_RESET, otpData);
      throw new BadRequestException('Invalid OTP');
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(
      { id: user.id },
      { password_hash: hashedPassword }
    );

    await this.deleteOtpData(email, OtpType.PASSWORD_RESET);

    return { message: 'Password reset successfully' };
  }

  async verifyOtp(identifier: string, otp: string, type: OtpType) {
    const otpData = await this.getOtpData(identifier, type);

    if (!otpData) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (otpData.attempts >= this.MAX_OTP_ATTEMPTS) {
      throw new BadRequestException('Maximum OTP attempts exceeded');
    }

    const isOtpValid = await bcrypt.compare(otp, otpData.otpHash);

    if (!isOtpValid) {
      otpData.attempts += 1;
      await this.saveOtpData(identifier, type, otpData);
      throw new BadRequestException('Invalid OTP');
    }

    await this.deleteOtpData(identifier, type);

    if (type === OtpType.EMAIL_VERIFY) {
      await this.userRepository.update(
        { email: identifier },
        { email_verified_at: new Date() }
      );
    } else if (type === OtpType.PHONE_VERIFY) {
      await this.userRepository.update(
        { phone: identifier },
        { phone_verified_at: new Date() }
      );
    }

    return { message: 'OTP verified successfully' };
  }

  async resendOtp(identifier: string, type: OtpType) {
    const otp = this.generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    await this.saveOtpData(identifier, type, {
      otpHash,
      attempts: 0,
      createdAt: new Date().toISOString(),
    });

    try {
      if (type === OtpType.EMAIL_VERIFY || type === OtpType.PASSWORD_RESET) {
        const emailType = type === OtpType.EMAIL_VERIFY ? 'verification' : 'password-reset';
        await this.emailService.sendOtpEmail(identifier, otp, emailType);
        this.logger.log(`OTP sent to ${identifier} for type: ${type}`);
      } else if (type === OtpType.PHONE_VERIFY) {
        this.logger.warn(`Phone OTP sending not implemented for ${identifier}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${identifier}:`, error);
      throw new RpcException({
        statusCode: 500,
        message: 'Failed to send OTP. Please try again later.',
      });
    }

    return { message: 'OTP resent successfully' };
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET') || 'your-secret-key',
      expiresIn: '2d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'your-refresh-secret',
      expiresIn: '7d',
    });

    const tokenHash = await bcrypt.hash(refreshToken, 10);

    await this.refreshTokenRepository.save({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      is_revoked: false,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private getOtpRedisKey(identifier: string, type: OtpType): string {
    return `otp:${type}:${identifier}`;
  }

  private async getOtpData(identifier: string, type: OtpType): Promise<OtpData | null> {
    const key = this.getOtpRedisKey(identifier, type);
    const data = await this.redisService.get(key);

    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      this.logger.error(`Failed to parse OTP data for ${identifier}:`, error);
      return null;
    }
  }

  private async saveOtpData(identifier: string, type: OtpType, otpData: OtpData): Promise<void> {
    const key = this.getOtpRedisKey(identifier, type);
    await this.redisService.set(key, JSON.stringify(otpData), this.OTP_TTL_SECONDS);
  }

  private async deleteOtpData(identifier: string, type: OtpType): Promise<void> {
    const key = this.getOtpRedisKey(identifier, type);
    await this.redisService.del(key);
  }
}
