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
  OperatingHours,
  User
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
      host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT) || 5432,
      username: process.env.DATABASE_USER || process.env.POSTGRES_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || process.env.POSTGRES_DB || 'food_delivery',
      entities: [Restaurant, RestaurantCategory, RestaurantCategoryMapping, MenuCategory, MenuItem, MenuItemOption, OperatingHours, User],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([Restaurant, RestaurantCategory, RestaurantCategoryMapping, MenuCategory, MenuItem, MenuItemOption, OperatingHours, User]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class AppModule {}
