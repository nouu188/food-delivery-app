import { Module, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import type { JwtSignOptions } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: {
          expiresIn: configService.get<JwtSignOptions['expiresIn']>(
            'JWT_EXPIRES_IN',
          ) ?? '1d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [JwtStrategy, JwtAuthGuard, RolesGuard, PassportModule, JwtModule],
})
export class CommonModule {}
