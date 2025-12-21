import { Injectable, UnauthorizedException, BadRequestException, ConflictException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, RefreshToken, OtpVerification } from '@backend/database';
import { RegisterDto, LoginDto, RegisterResponseDto } from '@backend/shared';
import { OtpType, UserStatus } from '@backend/shared';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(OtpVerification)
    private readonly otpRepository: Repository<OtpVerification>,
    private readonly jwtService: JwtService,
  ) { }

  private readonly logger = new Logger('AuthService');

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: [
          { email: registerDto.email },
          { phone: registerDto.phone },
        ],
      });

      if (existingUser) {
        throw new RpcException(new ConflictException('User with this email or phone already exists'));
      }

      if (!registerDto.password) {
        throw new RpcException(new InternalServerErrorException('Password is required'));
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
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE && user.status !== UserStatus.PENDING_VERIFICATION) {
      throw new UnauthorizedException('Account is suspended or inactive');
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
  }

  async logout(userId: string, refreshToken: string) {
    await this.refreshTokenRepository.update(
      { user_id: userId, token_hash: await bcrypt.hash(refreshToken, 10) },
      { is_revoked: true },
    );

    return { message: 'Logged out successfully' };
  }

  async refreshToken(refreshToken: string) {
    const decoded = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    });

    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { user_id: decoded.sub, is_revoked: false },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.expires_at < new Date()) {
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
      { id: storedToken.id },
      { is_revoked: true },
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

    await this.otpRepository.save({
      identifier: email,
      otp_hash: otpHash,
      type: OtpType.PASSWORD_RESET,
      expires_at: new Date(Date.now() + 10 * 60 * 1000),
      attempts: 0,
      is_used: false,
    });

    return { message: 'If email exists, OTP has been sent' };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const otpRecord = await this.otpRepository.findOne({
      where: {
        identifier: email,
        type: OtpType.PASSWORD_RESET,
        is_used: false,
      },
      order: { created_at: 'DESC' },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (otpRecord.expires_at < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    if (otpRecord.attempts >= 3) {
      throw new BadRequestException('Maximum OTP attempts exceeded');
    }

    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp_hash);

    if (!isOtpValid) {
      await this.otpRepository.update(
        { id: otpRecord.id },
        { attempts: otpRecord.attempts + 1 },
      );
      throw new BadRequestException('Invalid OTP');
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(
      { id: user.id },
      { password_hash: hashedPassword },
    );

    await this.otpRepository.update(
      { id: otpRecord.id },
      { is_used: true },
    );

    return { message: 'Password reset successfully' };
  }

  async verifyOtp(identifier: string, otp: string, type: OtpType) {
    const otpRecord = await this.otpRepository.findOne({
      where: { identifier, type, is_used: false },
      order: { created_at: 'DESC' },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (otpRecord.expires_at < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    if (otpRecord.attempts >= 3) {
      throw new BadRequestException('Maximum OTP attempts exceeded');
    }

    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp_hash);

    if (!isOtpValid) {
      await this.otpRepository.update(
        { id: otpRecord.id },
        { attempts: otpRecord.attempts + 1 },
      );
      throw new BadRequestException('Invalid OTP');
    }

    await this.otpRepository.update(
      { id: otpRecord.id },
      { is_used: true },
    );

    if (type === OtpType.EMAIL_VERIFY) {
      await this.userRepository.update(
        { email: identifier },
        { email_verified_at: new Date() },
      );
    } else if (type === OtpType.PHONE_VERIFY) {
      await this.userRepository.update(
        { phone: identifier },
        { phone_verified_at: new Date() },
      );
    }

    return { message: 'OTP verified successfully' };
  }

  async resendOtp(identifier: string, type: OtpType) {
    const otp = this.generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    await this.otpRepository.save({
      identifier,
      otp_hash: otpHash,
      type,
      expires_at: new Date(Date.now() + 10 * 60 * 1000),
      attempts: 0,
      is_used: false,
    });

    return { message: 'OTP resent successfully' };
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'your-secret-key',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
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
}
