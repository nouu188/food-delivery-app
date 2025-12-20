import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RestaurantService } from './restaurant.service';
import { JwtAuthGuard, Roles, RolesGuard } from '@backend/common';
import { UserRole, CreateRestaurantDto, UpdateRestaurantDto, CreateMenuCategoryDto, UpdateMenuCategoryDto, CreateMenuItemDto, UpdateMenuItemDto, CreateMenuItemOptionDto, UpdateMenuItemOptionDto } from '@backend/shared';
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

  @Get()
  @MessagePattern(RESTAURANT_PATTERNS.FIND_ALL_RESTAURANTS)
  async findAll(@Query() query: any) {
    return this.restaurantService.findAll(query);
  }

  @Get(':id')
  @MessagePattern(RESTAURANT_PATTERNS.FIND_ONE_RESTAURANT)
  async findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(id);
  }

  @Post()
  @MessagePattern(RESTAURANT_PATTERNS.CREATE_RESTAURANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async create(@Request() req: any, @Body() data: CreateRestaurantDto) {
    return this.restaurantService.create(req.user.id, data);
  }

  @Put(':id')
  @MessagePattern(RESTAURANT_PATTERNS.UPDATE_RESTAURANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async update(@Request() req: any, @Param('id') id: string, @Body() data: UpdateRestaurantDto) {
    return this.restaurantService.update(id, req.user.id, data);
  }

  @Put(':id/status')
  @MessagePattern(RESTAURANT_PATTERNS.TOGGLE_STATUS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async toggleStatus(@Request() req: any, @Param('id') id: string) {
    return this.restaurantService.toggleStatus(id, req.user.id);
  }

  @Get(':id/menu')
  @MessagePattern(RESTAURANT_PATTERNS.GET_MENU)
  async getMenu(@Param('id') id: string) {
    return this.restaurantService.getMenu(id);
  }

  @Post('menu-categories')
  @MessagePattern(RESTAURANT_PATTERNS.CREATE_MENU_CATEGORY)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async createMenuCategory(@Body() data: CreateMenuCategoryDto) {
    return this.restaurantService.createMenuCategory(data);
  }

  @Put('menu-categories/:id')
  @MessagePattern(RESTAURANT_PATTERNS.UPDATE_MENU_CATEGORY)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async updateMenuCategory(@Param('id') id: string, @Body() data: UpdateMenuCategoryDto) {
    return this.restaurantService.updateMenuCategory(id, data);
  }

  @Delete('menu-categories/:id')
  @MessagePattern(RESTAURANT_PATTERNS.DELETE_MENU_CATEGORY)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async deleteMenuCategory(@Param('id') id: string) {
    return this.restaurantService.deleteMenuCategory(id);
  }

  @Post('menu-items')
  @MessagePattern(RESTAURANT_PATTERNS.CREATE_MENU_ITEM)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async createMenuItem(@Body() data: CreateMenuItemDto) {
    return this.restaurantService.createMenuItem(data);
  }

  @Put('menu-items/:id')
  @MessagePattern(RESTAURANT_PATTERNS.UPDATE_MENU_ITEM)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async updateMenuItem(@Param('id') id: string, @Body() data: UpdateMenuItemDto) {
    return this.restaurantService.updateMenuItem(id, data);
  }

  @Delete('menu-items/:id')
  @MessagePattern(RESTAURANT_PATTERNS.DELETE_MENU_ITEM)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async deleteMenuItem(@Param('id') id: string) {
    return this.restaurantService.deleteMenuItem(id);
  }

  @Post('menu-items/:id/options')
  @MessagePattern(RESTAURANT_PATTERNS.CREATE_MENU_ITEM_OPTION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async createMenuItemOption(@Param('id') itemId: string, @Body() data: CreateMenuItemOptionDto) {
    return this.restaurantService.createMenuItemOption({ ...data, menu_item_id: itemId });
  }

  @Put('menu-item-options/:id')
  @MessagePattern(RESTAURANT_PATTERNS.UPDATE_MENU_ITEM_OPTION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async updateMenuItemOption(@Param('id') id: string, @Body() data: UpdateMenuItemOptionDto) {
    return this.restaurantService.updateMenuItemOption(id, data);
  }

  @Delete('menu-item-options/:id')
  @MessagePattern(RESTAURANT_PATTERNS.DELETE_MENU_ITEM_OPTION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async deleteMenuItemOption(@Param('id') id: string) {
    return this.restaurantService.deleteMenuItemOption(id);
  }

  @Get('categories/all')
  @MessagePattern(RESTAURANT_PATTERNS.GET_CATEGORIES)
  async getCategories() {
    return this.restaurantService.getCategories();
  }

  @Put(':id/operating-hours')
  @MessagePattern(RESTAURANT_PATTERNS.UPDATE_OPERATING_HOURS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async updateOperatingHours(@Param('id') id: string, @Body('hours') hours: any[]) {
    return this.restaurantService.updateOperatingHours(id, hours);
  }
}
