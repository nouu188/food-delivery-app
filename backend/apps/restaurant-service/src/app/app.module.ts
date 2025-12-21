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
  User,
  DatabaseModule
} from '@backend/database';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class AppModule {}
