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
    return firstValueFrom(
      this.userService.send(USER_PATTERNS.GET_PROFILE, { userId: req.user.id })
    );
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req: AuthenticatedRequest, @Body() updateData: UpdateProfileDto) {
    return firstValueFrom(
      this.userService.send(USER_PATTERNS.UPDATE_PROFILE, {
        userId: req.user.id,
        ...updateData,
      })
    );
  }

  @Get('addresses')
  @UseGuards(JwtAuthGuard)
  async getAddresses(@Request() req: AuthenticatedRequest) {
    return firstValueFrom(
      this.userService.send(USER_PATTERNS.GET_ADDRESSES, { userId: req.user.id })
    );
  }

  @Post('addresses')
  @UseGuards(JwtAuthGuard)
  async createAddress(@Request() req: AuthenticatedRequest, @Body() addressData: CreateAddressDto) {
    return firstValueFrom(
      this.userService.send(USER_PATTERNS.CREATE_ADDRESS, {
        userId: req.user.id,
        ...addressData,
      })
    );
  }

  @Put('addresses/:id')
  @UseGuards(JwtAuthGuard)
  async updateAddress(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() addressData: UpdateAddressDto
  ) {
    return firstValueFrom(
      this.userService.send(USER_PATTERNS.UPDATE_ADDRESS, {
        userId: req.user.id,
        addressId: id,
        ...addressData,
      })
    );
  }

  @Delete('addresses/:id')
  @UseGuards(JwtAuthGuard)
  async deleteAddress(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return firstValueFrom(
      this.userService.send(USER_PATTERNS.DELETE_ADDRESS, {
        userId: req.user.id,
        addressId: id,
      })
    );
  }

  @Put('devices')
  @UseGuards(JwtAuthGuard)
  async registerDevice(@Request() req: AuthenticatedRequest, @Body() deviceData: RegisterDeviceDto) {
    return firstValueFrom(
      this.userService.send(USER_PATTERNS.REGISTER_DEVICE, {
        userId: req.user.id,
        ...deviceData,
      })
    );
  }

  @Get('favorites')
  @UseGuards(JwtAuthGuard)
  async getFavorites(@Request() req: AuthenticatedRequest) {
    return firstValueFrom(
      this.userService.send(USER_PATTERNS.GET_FAVORITES, { userId: req.user.id })
    );
  }

  @Post('favorites/:restaurantId')
  @UseGuards(JwtAuthGuard)
  async addFavorite(@Request() req: AuthenticatedRequest, @Param('restaurantId') restaurantId: string) {
    return firstValueFrom(
      this.userService.send(USER_PATTERNS.ADD_FAVORITE, {
        userId: req.user.id,
        restaurantId,
      })
    );
  }

  @Delete('favorites/:restaurantId')
  @UseGuards(JwtAuthGuard)
  async removeFavorite(@Request() req: AuthenticatedRequest, @Param('restaurantId') restaurantId: string) {
    return firstValueFrom(
      this.userService.send(USER_PATTERNS.REMOVE_FAVORITE, {
        userId: req.user.id,
        restaurantId,
      })
    );
  }
}
