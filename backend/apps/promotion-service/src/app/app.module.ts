import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Voucher, VoucherUsage, User, Restaurant, DatabaseModule } from '@backend/database';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    DatabaseModule
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
})
export class AppModule {}
