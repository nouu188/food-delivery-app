import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RestaurantService } from './restaurant.service';
import { RESTAURANT_PATTERNS } from '@backend/contracts';
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'restaurant-service',
      timestamp: new Date().toISOString(),
    };
  }

  @MessagePattern(RESTAURANT_PATTERNS.FIND_ALL_RESTAURANTS)
  async findAll(query: any) {
    return this.restaurantService.findAll(query);
  }

  @MessagePattern(RESTAURANT_PATTERNS.FIND_ONE_RESTAURANT)
  async findOne(data: { id: string }) {
    return this.restaurantService.findOne(data.id);
  }

  @MessagePattern(RESTAURANT_PATTERNS.CREATE_RESTAURANT)
  async create(data: any) {
    return this.restaurantService.create(data.userId, data);
  }

  @MessagePattern(RESTAURANT_PATTERNS.UPDATE_RESTAURANT)
  async update(data: any) {
    return this.restaurantService.update(data.id, data.userId, data);
  }

  @MessagePattern(RESTAURANT_PATTERNS.TOGGLE_STATUS)
  async toggleStatus(data: { id: string; userId: string }) {
    return this.restaurantService.toggleStatus(data.id, data.userId);
  }

  @MessagePattern(RESTAURANT_PATTERNS.GET_MENU)
  async getMenu(data: { id: string }) {
    return this.restaurantService.getMenu(data.id);
  }

  @MessagePattern(RESTAURANT_PATTERNS.CREATE_MENU_CATEGORY)
  async createMenuCategory(data: any) {
    return this.restaurantService.createMenuCategory(data);
  }

  @MessagePattern(RESTAURANT_PATTERNS.UPDATE_MENU_CATEGORY)
  async updateMenuCategory(data: any) {
    return this.restaurantService.updateMenuCategory(data.id, data);
  }

  @MessagePattern(RESTAURANT_PATTERNS.DELETE_MENU_CATEGORY)
  async deleteMenuCategory(data: { id: string }) {
    return this.restaurantService.deleteMenuCategory(data.id);
  }

  @MessagePattern(RESTAURANT_PATTERNS.CREATE_MENU_ITEM)
  async createMenuItem(data: any) {
    return this.restaurantService.createMenuItem(data);
  }

  @MessagePattern(RESTAURANT_PATTERNS.UPDATE_MENU_ITEM)
  async updateMenuItem(data: any) {
    return this.restaurantService.updateMenuItem(data.id, data);
  }

  @MessagePattern(RESTAURANT_PATTERNS.DELETE_MENU_ITEM)
  async deleteMenuItem(data: { id: string }) {
    return this.restaurantService.deleteMenuItem(data.id);
  }

  @MessagePattern(RESTAURANT_PATTERNS.CREATE_MENU_ITEM_OPTION)
  async createMenuItemOption(data: any) {
    return this.restaurantService.createMenuItemOption(data);
  }

  @MessagePattern(RESTAURANT_PATTERNS.UPDATE_MENU_ITEM_OPTION)
  async updateMenuItemOption(data: any) {
    return this.restaurantService.updateMenuItemOption(data.id, data);
  }

  @MessagePattern(RESTAURANT_PATTERNS.DELETE_MENU_ITEM_OPTION)
  async deleteMenuItemOption(data: { id: string }) {
    return this.restaurantService.deleteMenuItemOption(data.id);
  }

  @MessagePattern(RESTAURANT_PATTERNS.GET_CATEGORIES)
  async getCategories() {
    return this.restaurantService.getCategories();
  }

  @MessagePattern(RESTAURANT_PATTERNS.UPDATE_OPERATING_HOURS)
  async updateOperatingHours(data: { id: string; hours: any[] }) {
    return this.restaurantService.updateOperatingHours(data.id, data.hours);
  }
}
