import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard, Roles, RolesGuard, AuthenticatedRequest } from '@backend/common';
import {
  UserRole,
  RestaurantQueryDto,
  CreateRestaurantDto,
  UpdateRestaurantDto,
  CreateMenuCategoryDto,
  UpdateMenuCategoryDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  CreateMenuItemOptionDto,
  UpdateMenuItemOptionDto,
  UpdateRestaurantOperatingHoursDto,
} from '@backend/shared';
import { RESTAURANT_PATTERNS } from '@backend/contracts';

@Controller('restaurants')
export class RestaurantController {
  constructor(
    @Inject('RESTAURANT_SERVICE') private readonly restaurantService: ClientProxy
  ) {}

  @Get()
  async findAll(@Query() query: RestaurantQueryDto) {
    return firstValueFrom(this.restaurantService.send(RESTAURANT_PATTERNS.FIND_ALL_RESTAURANTS, query));
  }

  @Get('categories/all')
  async getCategories() {
    return firstValueFrom(this.restaurantService.send(RESTAURANT_PATTERNS.GET_CATEGORIES, {}));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return firstValueFrom(
      this.restaurantService.send(RESTAURANT_PATTERNS.FIND_ONE_RESTAURANT, { id })
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async create(@Request() req: AuthenticatedRequest, @Body() data: CreateRestaurantDto) {
    return firstValueFrom(
      this.restaurantService.send(RESTAURANT_PATTERNS.CREATE_RESTAURANT, {
        userId: req.user.id,
        ...data,
      })
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: UpdateRestaurantDto
  ) {
    return firstValueFrom(
      this.restaurantService.send(RESTAURANT_PATTERNS.UPDATE_RESTAURANT, {
        id,
        userId: req.user.id,
        ...data,
      })
    );
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async toggleStatus(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return firstValueFrom(
      this.restaurantService.send(RESTAURANT_PATTERNS.TOGGLE_STATUS, {
        id,
        userId: req.user.id,
      })
    );
  }

  @Get(':id/menu')
  async getMenu(@Param('id') id: string) {
    return firstValueFrom(this.restaurantService.send(RESTAURANT_PATTERNS.GET_MENU, { id }));
  }

  @Post('menu-categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async createMenuCategory(@Body() data: CreateMenuCategoryDto) {
    return firstValueFrom(
      this.restaurantService.send(RESTAURANT_PATTERNS.CREATE_MENU_CATEGORY, data)
    );
  }

  @Put('menu-categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async updateMenuCategory(@Param('id') id: string, @Body() data: UpdateMenuCategoryDto) {
    return firstValueFrom(
      this.restaurantService.send(RESTAURANT_PATTERNS.UPDATE_MENU_CATEGORY, { id, ...data })
    );
  }

  @Delete('menu-categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async deleteMenuCategory(@Param('id') id: string) {
    return firstValueFrom(
      this.restaurantService.send(RESTAURANT_PATTERNS.DELETE_MENU_CATEGORY, { id })
    );
  }

  @Post('menu-items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async createMenuItem(@Body() data: CreateMenuItemDto) {
    return firstValueFrom(this.restaurantService.send(RESTAURANT_PATTERNS.CREATE_MENU_ITEM, data));
  }

  @Put('menu-items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async updateMenuItem(@Param('id') id: string, @Body() data: UpdateMenuItemDto) {
    return firstValueFrom(
      this.restaurantService.send(RESTAURANT_PATTERNS.UPDATE_MENU_ITEM, { id, ...data })
    );
  }

  @Delete('menu-items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async deleteMenuItem(@Param('id') id: string) {
    return firstValueFrom(
      this.restaurantService.send(RESTAURANT_PATTERNS.DELETE_MENU_ITEM, { id })
    );
  }

  @Post('menu-items/:id/options')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async createMenuItemOption(@Param('id') itemId: string, @Body() data: CreateMenuItemOptionDto) {
    return firstValueFrom(
      this.restaurantService.send(RESTAURANT_PATTERNS.CREATE_MENU_ITEM_OPTION, {
        ...data,
        menu_item_id: itemId,
      })
    );
  }

  @Put('menu-item-options/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async updateMenuItemOption(@Param('id') id: string, @Body() data: UpdateMenuItemOptionDto) {
    return firstValueFrom(
      this.restaurantService.send(RESTAURANT_PATTERNS.UPDATE_MENU_ITEM_OPTION, { id, ...data })
    );
  }

  @Delete('menu-item-options/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async deleteMenuItemOption(@Param('id') id: string) {
    return firstValueFrom(
      this.restaurantService.send(RESTAURANT_PATTERNS.DELETE_MENU_ITEM_OPTION, { id })
    );
  }

  @Put(':id/operating-hours')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async updateOperatingHours(@Param('id') id: string, @Body() body: UpdateRestaurantOperatingHoursDto) {
    return firstValueFrom(
      this.restaurantService.send(RESTAURANT_PATTERNS.UPDATE_OPERATING_HOURS, { id, hours: body.hours })
    );
  }
}
