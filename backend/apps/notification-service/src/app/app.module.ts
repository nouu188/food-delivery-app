import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Notification, User } from '@backend/database';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT) || 5432,
      username: process.env.DATABASE_USER || process.env.POSTGRES_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || process.env.POSTGRES_DB || 'food_delivery',
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([Notification]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class AppModule {}
