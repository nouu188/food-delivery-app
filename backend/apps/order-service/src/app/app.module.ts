import { DatabaseModule } from '@backend/database';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class AppModule {}
