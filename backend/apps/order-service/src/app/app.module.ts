import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Cart, CartItem, Order, OrderItem, OrderStatusHistory, User, UserAddress, Restaurant, MenuItem } from '@backend/database';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT) || 5432,
      username: process.env.DATABASE_USER || process.env.POSTGRES_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || process.env.POSTGRES_DB || 'food_delivery',
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([Cart, CartItem, Order, OrderItem, OrderStatusHistory]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class AppModule {}
