import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RestaurantService } from './restaurant.service';
import { JwtAuthGuard, Roles, RolesGuard } from '@backend/common';
import { UserRole } from '@backend/shared';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  @MessagePattern('restaurant.find-all')
  async findAll(@Query() query: any) {
    return this.restaurantService.findAll(query);
  }

  @Get(':id')
  @MessagePattern('restaurant.find-one')
  async findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(id);
  }

  @Post()
  @MessagePattern('restaurant.create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async create(@Request() req: any, @Body() data: any) {
    return this.restaurantService.create(req.user.id, data);
  }

  @Put(':id')
  @MessagePattern('restaurant.update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async update(@Request() req: any, @Param('id') id: string, @Body() data: any) {
    return this.restaurantService.update(id, req.user.id, data);
  }

  @Put(':id/status')
  @MessagePattern('restaurant.toggle-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async toggleStatus(@Request() req: any, @Param('id') id: string) {
    return this.restaurantService.toggleStatus(id, req.user.id);
  }

  @Get(':id/menu')
  @MessagePattern('restaurant.get-menu')
  async getMenu(@Param('id') id: string) {
    return this.restaurantService.getMenu(id);
  }

  @Post('menu-categories')
  @MessagePattern('restaurant.create-menu-category')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async createMenuCategory(@Body() data: any) {
    return this.restaurantService.createMenuCategory(data);
  }

  @Put('menu-categories/:id')
  @MessagePattern('restaurant.update-menu-category')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async updateMenuCategory(@Param('id') id: string, @Body() data: any) {
    return this.restaurantService.updateMenuCategory(id, data);
  }

  @Delete('menu-categories/:id')
  @MessagePattern('restaurant.delete-menu-category')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async deleteMenuCategory(@Param('id') id: string) {
    return this.restaurantService.deleteMenuCategory(id);
  }

  @Post('menu-items')
  @MessagePattern('restaurant.create-menu-item')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async createMenuItem(@Body() data: any) {
    return this.restaurantService.createMenuItem(data);
  }

  @Put('menu-items/:id')
  @MessagePattern('restaurant.update-menu-item')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async updateMenuItem(@Param('id') id: string, @Body() data: any) {
    return this.restaurantService.updateMenuItem(id, data);
  }

  @Delete('menu-items/:id')
  @MessagePattern('restaurant.delete-menu-item')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async deleteMenuItem(@Param('id') id: string) {
    return this.restaurantService.deleteMenuItem(id);
  }

  @Post('menu-items/:id/options')
  @MessagePattern('restaurant.create-menu-item-option')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async createMenuItemOption(@Param('id') itemId: string, @Body() data: any) {
    return this.restaurantService.createMenuItemOption({ ...data, menu_item_id: itemId });
  }

  @Put('menu-item-options/:id')
  @MessagePattern('restaurant.update-menu-item-option')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async updateMenuItemOption(@Param('id') id: string, @Body() data: any) {
    return this.restaurantService.updateMenuItemOption(id, data);
  }

  @Delete('menu-item-options/:id')
  @MessagePattern('restaurant.delete-menu-item-option')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async deleteMenuItemOption(@Param('id') id: string) {
    return this.restaurantService.deleteMenuItemOption(id);
  }

  @Get('categories/all')
  @MessagePattern('restaurant.get-categories')
  async getCategories() {
    return this.restaurantService.getCategories();
  }

  @Put(':id/operating-hours')
  @MessagePattern('restaurant.update-operating-hours')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async updateOperatingHours(@Param('id') id: string, @Body('hours') hours: any[]) {
    return this.restaurantService.updateOperatingHours(id, hours);
  }
}
