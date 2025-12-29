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
  HttpException,
  HttpStatus,
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
    try {
      return await firstValueFrom(this.restaurantService.send(RESTAURANT_PATTERNS.FIND_ALL_RESTAURANTS, query));
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get restaurants',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal restaurant error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('categories/all')
  async getCategories() {
    try {
      return await firstValueFrom(this.restaurantService.send(RESTAURANT_PATTERNS.GET_CATEGORIES, {}));
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get categories',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal restaurant error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.restaurantService.send(RESTAURANT_PATTERNS.FIND_ONE_RESTAURANT, { id })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Restaurant not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get restaurant',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal restaurant error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async create(@Request() req: AuthenticatedRequest, @Body() data: CreateRestaurantDto) {
    try {
      return await firstValueFrom(
        this.restaurantService.send(RESTAURANT_PATTERNS.CREATE_RESTAURANT, {
          userId: req.user.id,
          ...data,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 409) {
        throw new HttpException(
          errorData.message || 'Restaurant already exists',
          HttpStatus.CONFLICT,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid restaurant data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to create restaurant',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal restaurant error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: UpdateRestaurantDto
  ) {
    try {
      return await firstValueFrom(
        this.restaurantService.send(RESTAURANT_PATTERNS.UPDATE_RESTAURANT, {
          id,
          userId: req.user.id,
          ...data,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Restaurant not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to update this restaurant',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid restaurant data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to update restaurant',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal restaurant error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async toggleStatus(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.restaurantService.send(RESTAURANT_PATTERNS.TOGGLE_STATUS, {
          id,
          userId: req.user.id,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Restaurant not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to update this restaurant',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to toggle restaurant status',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal restaurant error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/menu')
  async getMenu(@Param('id') id: string) {
    try {
      return await firstValueFrom(this.restaurantService.send(RESTAURANT_PATTERNS.GET_MENU, { id }));
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Restaurant not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get menu',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal restaurant error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('menu-categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async createMenuCategory(@Body() data: CreateMenuCategoryDto) {
    try {
      return await firstValueFrom(
        this.restaurantService.send(RESTAURANT_PATTERNS.CREATE_MENU_CATEGORY, data)
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid menu category data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to create menu category',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to create menu category',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal restaurant error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('menu-categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async updateMenuCategory(@Param('id') id: string, @Body() data: UpdateMenuCategoryDto) {
    try {
      return await firstValueFrom(
        this.restaurantService.send(RESTAURANT_PATTERNS.UPDATE_MENU_CATEGORY, { id, ...data })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Menu category not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to update this menu category',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid menu category data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to update menu category',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal restaurant error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('menu-categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async deleteMenuCategory(@Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.restaurantService.send(RESTAURANT_PATTERNS.DELETE_MENU_CATEGORY, { id })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Menu category not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to delete this menu category',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to delete menu category',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal restaurant error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('menu-items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async createMenuItem(@Body() data: CreateMenuItemDto) {
    try {
      return await firstValueFrom(this.restaurantService.send(RESTAURANT_PATTERNS.CREATE_MENU_ITEM, data));
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid menu item data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to create menu item',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to create menu item',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal restaurant error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('menu-items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async updateMenuItem(@Param('id') id: string, @Body() data: UpdateMenuItemDto) {
    try {
      return await firstValueFrom(
        this.restaurantService.send(RESTAURANT_PATTERNS.UPDATE_MENU_ITEM, { id, ...data })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Menu item not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to update this menu item',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid menu item data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to update menu item',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal restaurant error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('menu-items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async deleteMenuItem(@Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.restaurantService.send(RESTAURANT_PATTERNS.DELETE_MENU_ITEM, { id })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Menu item not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to delete this menu item',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to delete menu item',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal restaurant error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('menu-items/:id/options')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async createMenuItemOption(@Param('id') itemId: string, @Body() data: CreateMenuItemOptionDto) {
    try {
      return await firstValueFrom(
        this.restaurantService.send(RESTAURANT_PATTERNS.CREATE_MENU_ITEM_OPTION, {
          ...data,
          menu_item_id: itemId,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Menu item not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid menu item option data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to create menu item option',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to create menu item option',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal restaurant error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('menu-item-options/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async updateMenuItemOption(@Param('id') id: string, @Body() data: UpdateMenuItemOptionDto) {
    try {
      return await firstValueFrom(
        this.restaurantService.send(RESTAURANT_PATTERNS.UPDATE_MENU_ITEM_OPTION, { id, ...data })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Menu item option not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to update this menu item option',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid menu item option data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to update menu item option',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal restaurant error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('menu-item-options/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async deleteMenuItemOption(@Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.restaurantService.send(RESTAURANT_PATTERNS.DELETE_MENU_ITEM_OPTION, { id })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Menu item option not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to delete this menu item option',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to delete menu item option',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal restaurant error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id/operating-hours')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async updateOperatingHours(@Param('id') id: string, @Body() body: UpdateRestaurantOperatingHoursDto) {
    try {
      return await firstValueFrom(
        this.restaurantService.send(RESTAURANT_PATTERNS.UPDATE_OPERATING_HOURS, { id, hours: body.hours })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Restaurant not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to update operating hours',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid operating hours data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to update operating hours',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal restaurant error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
