import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { USER_PATTERNS } from '@backend/contracts';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'user-service',
      timestamp: new Date().toISOString(),
    };
  }

  @MessagePattern(USER_PATTERNS.GET_PROFILE)
  async getProfile(data: { userId: string }) {
    return this.userService.getProfile(data.userId);
  }

  @MessagePattern(USER_PATTERNS.UPDATE_PROFILE)
  async updateProfile(data: any) {
    return this.userService.updateProfile(data.userId, data);
  }

  @MessagePattern(USER_PATTERNS.GET_ADDRESSES)
  async getAddresses(data: { userId: string }) {
    return this.userService.getAddresses(data.userId);
  }

  @MessagePattern(USER_PATTERNS.CREATE_ADDRESS)
  async createAddress(data: any) {
    return this.userService.createAddress(data.userId, data);
  }

  @MessagePattern(USER_PATTERNS.UPDATE_ADDRESS)
  async updateAddress(data: any) {
    return this.userService.updateAddress(data.userId, data.addressId, data);
  }

  @MessagePattern(USER_PATTERNS.DELETE_ADDRESS)
  async deleteAddress(data: { userId: string; addressId: string }) {
    return this.userService.deleteAddress(data.userId, data.addressId);
  }

  @MessagePattern(USER_PATTERNS.REGISTER_DEVICE)
  async registerDevice(data: any) {
    return this.userService.registerDevice(data.userId, data);
  }

  @MessagePattern(USER_PATTERNS.GET_FAVORITES)
  async getFavorites(data: { userId: string }) {
    return this.userService.getFavorites(data.userId);
  }

  @MessagePattern(USER_PATTERNS.ADD_FAVORITE)
  async addFavorite(data: { userId: string; restaurantId: string }) {
    return this.userService.addFavorite(data.userId, data.restaurantId);
  }

  @MessagePattern(USER_PATTERNS.REMOVE_FAVORITE)
  async removeFavorite(data: { userId: string; restaurantId: string }) {
    return this.userService.removeFavorite(data.userId, data.restaurantId);
  }
}
