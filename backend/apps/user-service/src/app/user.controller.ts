import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@backend/common';
import { USER_PATTERNS } from '@backend/contracts';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @MessagePattern(USER_PATTERNS.GET_PROFILE)
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    return this.userService.getProfile(req.user.id);
  }

  @Put('me')
  @MessagePattern(USER_PATTERNS.UPDATE_PROFILE)
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req: any, @Body() updateData: any) {
    return this.userService.updateProfile(req.user.id, updateData);
  }

  @Get('addresses')
  @MessagePattern(USER_PATTERNS.GET_ADDRESSES)
  @UseGuards(JwtAuthGuard)
  async getAddresses(@Request() req: any) {
    return this.userService.getAddresses(req.user.id);
  }

  @Post('addresses')
  @MessagePattern(USER_PATTERNS.CREATE_ADDRESS)
  @UseGuards(JwtAuthGuard)
  async createAddress(@Request() req: any, @Body() addressData: any) {
    return this.userService.createAddress(req.user.id, addressData);
  }

  @Put('addresses/:id')
  @MessagePattern(USER_PATTERNS.UPDATE_ADDRESS)
  @UseGuards(JwtAuthGuard)
  async updateAddress(@Request() req: any, @Param('id') id: string, @Body() addressData: any) {
    return this.userService.updateAddress(req.user.id, id, addressData);
  }

  @Delete('addresses/:id')
  @MessagePattern(USER_PATTERNS.DELETE_ADDRESS)
  @UseGuards(JwtAuthGuard)
  async deleteAddress(@Request() req: any, @Param('id') id: string) {
    return this.userService.deleteAddress(req.user.id, id);
  }

  @Put('devices')
  @MessagePattern(USER_PATTERNS.REGISTER_DEVICE)
  @UseGuards(JwtAuthGuard)
  async registerDevice(@Request() req: any, @Body() deviceData: any) {
    return this.userService.registerDevice(req.user.id, deviceData);
  }

  @Get('favorites')
  @MessagePattern(USER_PATTERNS.GET_FAVORITES)
  @UseGuards(JwtAuthGuard)
  async getFavorites(@Request() req: any) {
    return this.userService.getFavorites(req.user.id);
  }

  @Post('favorites/:restaurantId')
  @MessagePattern(USER_PATTERNS.ADD_FAVORITE)
  @UseGuards(JwtAuthGuard)
  async addFavorite(@Request() req: any, @Param('restaurantId') restaurantId: string) {
    return this.userService.addFavorite(req.user.id, restaurantId);
  }

  @Delete('favorites/:restaurantId')
  @MessagePattern(USER_PATTERNS.REMOVE_FAVORITE)
  @UseGuards(JwtAuthGuard)
  async removeFavorite(@Request() req: any, @Param('restaurantId') restaurantId: string) {
    return this.userService.removeFavorite(req.user.id, restaurantId);
  }
}
