import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard, AuthenticatedRequest } from '@backend/common';
import { USER_PATTERNS } from '@backend/contracts';
import {
  UpdateProfileDto,
  CreateAddressDto,
  UpdateAddressDto,
  RegisterDeviceDto,
} from '@backend/shared';

@Controller('users')
export class UserController {
  constructor(@Inject('USER_SERVICE') private readonly userService: ClientProxy) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: AuthenticatedRequest) {
    try {
      return await firstValueFrom(
        this.userService.send(USER_PATTERNS.GET_PROFILE, { userId: req.user.id })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'User not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get profile',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal user error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req: AuthenticatedRequest, @Body() updateData: UpdateProfileDto) {
    try {
      return await firstValueFrom(
        this.userService.send(USER_PATTERNS.UPDATE_PROFILE, {
          userId: req.user.id,
          ...updateData,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'User not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid profile data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to update profile',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal user error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('addresses')
  @UseGuards(JwtAuthGuard)
  async getAddresses(@Request() req: AuthenticatedRequest) {
    try {
      return await firstValueFrom(
        this.userService.send(USER_PATTERNS.GET_ADDRESSES, { userId: req.user.id })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get addresses',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal user error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('addresses')
  @UseGuards(JwtAuthGuard)
  async createAddress(@Request() req: AuthenticatedRequest, @Body() addressData: CreateAddressDto) {
    try {
      return await firstValueFrom(
        this.userService.send(USER_PATTERNS.CREATE_ADDRESS, {
          userId: req.user.id,
          ...addressData,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid address data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to create address',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal user error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('addresses/:id')
  @UseGuards(JwtAuthGuard)
  async updateAddress(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() addressData: UpdateAddressDto
  ) {
    try {
      return await firstValueFrom(
        this.userService.send(USER_PATTERNS.UPDATE_ADDRESS, {
          userId: req.user.id,
          addressId: id,
          ...addressData,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Address not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to update this address',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid address data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to update address',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal user error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('addresses/:id')
  @UseGuards(JwtAuthGuard)
  async deleteAddress(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.userService.send(USER_PATTERNS.DELETE_ADDRESS, {
          userId: req.user.id,
          addressId: id,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Address not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to delete this address',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to delete address',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal user error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('devices')
  @UseGuards(JwtAuthGuard)
  async registerDevice(@Request() req: AuthenticatedRequest, @Body() deviceData: RegisterDeviceDto) {
    try {
      return await firstValueFrom(
        this.userService.send(USER_PATTERNS.REGISTER_DEVICE, {
          userId: req.user.id,
          ...deviceData,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid device data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to register device',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal user error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  async getFavorites(@Request() req: AuthenticatedRequest) {
    try {
      return await firstValueFrom(
        this.userService.send(USER_PATTERNS.GET_FAVORITES, { userId: req.user.id })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get favorites',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal user error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('favorites/:restaurantId')
  @UseGuards(JwtAuthGuard)
  async addFavorite(@Request() req: AuthenticatedRequest, @Param('restaurantId') restaurantId: string) {
    try {
      return await firstValueFrom(
        this.userService.send(USER_PATTERNS.ADD_FAVORITE, {
          userId: req.user.id,
          restaurantId,
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

      if (errorData?.statusCode === 409) {
        throw new HttpException(
          errorData.message || 'Restaurant already in favorites',
          HttpStatus.CONFLICT,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to add favorite',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal user error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('favorites/:restaurantId')
  @UseGuards(JwtAuthGuard)
  async removeFavorite(@Request() req: AuthenticatedRequest, @Param('restaurantId') restaurantId: string) {
    try {
      return await firstValueFrom(
        this.userService.send(USER_PATTERNS.REMOVE_FAVORITE, {
          userId: req.user.id,
          restaurantId,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Favorite not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to remove favorite',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal user error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
