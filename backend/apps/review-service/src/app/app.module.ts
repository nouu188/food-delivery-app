import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Review, ReviewImage, Order, Restaurant, User, OperatingHours, DatabaseModule } from '@backend/database';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    DatabaseModule
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class AppModule {}
