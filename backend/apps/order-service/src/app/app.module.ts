import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Cart, CartItem, Order, OrderItem, OrderStatusHistory } from '@backend/database';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'food_delivery',
      entities: [Cart, CartItem, Order, OrderItem, OrderStatusHistory],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([Cart, CartItem, Order, OrderItem, OrderStatusHistory]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class AppModule {}
