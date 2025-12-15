import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@backend/common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @MessagePattern('user.get-profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    return this.userService.getProfile(req.user.id);
  }

  @Put('me')
  @MessagePattern('user.update-profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req: any, @Body() updateData: any) {
    return this.userService.updateProfile(req.user.id, updateData);
  }

  @Get('addresses')
  @MessagePattern('user.get-addresses')
  @UseGuards(JwtAuthGuard)
  async getAddresses(@Request() req: any) {
    return this.userService.getAddresses(req.user.id);
  }

  @Post('addresses')
  @MessagePattern('user.create-address')
  @UseGuards(JwtAuthGuard)
  async createAddress(@Request() req: any, @Body() addressData: any) {
    return this.userService.createAddress(req.user.id, addressData);
  }

  @Put('addresses/:id')
  @MessagePattern('user.update-address')
  @UseGuards(JwtAuthGuard)
  async updateAddress(@Request() req: any, @Param('id') id: string, @Body() addressData: any) {
    return this.userService.updateAddress(req.user.id, id, addressData);
  }

  @Delete('addresses/:id')
  @MessagePattern('user.delete-address')
  @UseGuards(JwtAuthGuard)
  async deleteAddress(@Request() req: any, @Param('id') id: string) {
    return this.userService.deleteAddress(req.user.id, id);
  }

  @Put('devices')
  @MessagePattern('user.register-device')
  @UseGuards(JwtAuthGuard)
  async registerDevice(@Request() req: any, @Body() deviceData: any) {
    return this.userService.registerDevice(req.user.id, deviceData);
  }

  @Get('favorites')
  @MessagePattern('user.get-favorites')
  @UseGuards(JwtAuthGuard)
  async getFavorites(@Request() req: any) {
    return this.userService.getFavorites(req.user.id);
  }

  @Post('favorites/:restaurantId')
  @MessagePattern('user.add-favorite')
  @UseGuards(JwtAuthGuard)
  async addFavorite(@Request() req: any, @Param('restaurantId') restaurantId: string) {
    return this.userService.addFavorite(req.user.id, restaurantId);
  }

  @Delete('favorites/:restaurantId')
  @MessagePattern('user.remove-favorite')
  @UseGuards(JwtAuthGuard)
  async removeFavorite(@Request() req: any, @Param('restaurantId') restaurantId: string) {
    return this.userService.removeFavorite(req.user.id, restaurantId);
  }
}
