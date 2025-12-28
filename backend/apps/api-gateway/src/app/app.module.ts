import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommonModule } from '@backend/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AuthController,
  UserController,
  RestaurantController,
  OrderController,
  PaymentController,
  DeliveryController,
  ReviewController,
  NotificationController,
  PromotionController,
} from './controllers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonModule,
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.AUTH_SERVICE_PORT) || 4001,
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.USER_SERVICE_PORT) || 4002,
        },
      },
      {
        name: 'RESTAURANT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.RESTAURANT_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.RESTAURANT_SERVICE_PORT) || 4003,
        },
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ORDER_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.ORDER_SERVICE_PORT) || 4004,
        },
      },
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PAYMENT_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.PAYMENT_SERVICE_PORT) || 4005,
        },
      },
      {
        name: 'DELIVERY_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.DELIVERY_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.DELIVERY_SERVICE_PORT) || 4006,
        },
      },
      {
        name: 'REVIEW_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.REVIEW_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.REVIEW_SERVICE_PORT) || 4007,
        },
      },
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.NOTIFICATION_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.NOTIFICATION_SERVICE_PORT) || 4008,
        },
      },
      {
        name: 'PROMOTION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PROMOTION_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.PROMOTION_SERVICE_PORT) || 4009,
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    RestaurantController,
    OrderController,
    PaymentController,
    DeliveryController,
    ReviewController,
    NotificationController,
    PromotionController,
  ],
  providers: [AppService],
})
export class AppModule {}
