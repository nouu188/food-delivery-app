import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {
  Restaurant,
  RestaurantCategory,
  RestaurantCategoryMapping,
  MenuCategory,
  MenuItem,
  MenuItemOption,
  OperatingHours
} from '@backend/database';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';

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
      entities: [Restaurant, RestaurantCategory, RestaurantCategoryMapping, MenuCategory, MenuItem, MenuItemOption, OperatingHours],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([Restaurant, RestaurantCategory, RestaurantCategoryMapping, MenuCategory, MenuItem, MenuItemOption, OperatingHours]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class AppModule {}
