import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserAddress, UserDevice, UserFavorite } from '@backend/database';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAddress)
    private readonly addressRepository: Repository<UserAddress>,
    @InjectRepository(UserDevice)
    private readonly deviceRepository: Repository<UserDevice>,
    @InjectRepository(UserFavorite)
    private readonly favoriteRepository: Repository<UserFavorite>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      role: user.role,
      status: user.status,
      email_verified_at: user.email_verified_at,
      phone_verified_at: user.phone_verified_at,
      created_at: user.created_at,
    };
  }

  async updateProfile(userId: string, updateData: any) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateData);
    await this.userRepository.save(user);

    return this.getProfile(userId);
  }

  async getAddresses(userId: string) {
    return this.addressRepository.find({
      where: { user_id: userId },
      order: { is_default: 'DESC', created_at: 'DESC' },
    });
  }

  async createAddress(userId: string, addressData: any) {
    if (addressData.is_default) {
      await this.addressRepository.update(
        { user_id: userId, is_default: true },
        { is_default: false },
      );
    }

    const address = this.addressRepository.create({
      ...addressData,
      user_id: userId,
    });

    return this.addressRepository.save(address);
  }

  async updateAddress(userId: string, addressId: string, addressData: any) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId, user_id: userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (addressData.is_default) {
      await this.addressRepository.update(
        { user_id: userId, is_default: true },
        { is_default: false },
      );
    }

    Object.assign(address, addressData);
    return this.addressRepository.save(address);
  }

  async deleteAddress(userId: string, addressId: string) {
    const result = await this.addressRepository.softDelete({
      id: addressId,
      user_id: userId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Address not found');
    }

    return { message: 'Address deleted successfully' };
  }

  async registerDevice(userId: string, deviceData: any) {
    const existingDevice = await this.deviceRepository.findOne({
      where: { device_token: deviceData.device_token },
    });

    if (existingDevice) {
      existingDevice.user_id = userId;
      existingDevice.platform = deviceData.platform;
      existingDevice.is_active = true;
      return this.deviceRepository.save(existingDevice);
    }

    const device = this.deviceRepository.create({
      ...deviceData,
      user_id: userId,
      is_active: true,
    });

    return this.deviceRepository.save(device);
  }

  async getFavorites(userId: string) {
    const favorites = await this.favoriteRepository.find({
      where: { user_id: userId },
      relations: ['restaurant'],
      order: { created_at: 'DESC' },
    });

    return favorites.map(f => ({
      id: f.id,
      restaurant_id: f.restaurant_id,
      created_at: f.created_at,
    }));
  }

  async addFavorite(userId: string, restaurantId: string) {
    const existing = await this.favoriteRepository.findOne({
      where: { user_id: userId, restaurant_id: restaurantId },
    });

    if (existing) {
      throw new ConflictException('Restaurant already in favorites');
    }

    const favorite = this.favoriteRepository.create({
      user_id: userId,
      restaurant_id: restaurantId,
    });

    return this.favoriteRepository.save(favorite);
  }

  async removeFavorite(userId: string, restaurantId: string) {
    const result = await this.favoriteRepository.delete({
      user_id: userId,
      restaurant_id: restaurantId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Favorite not found');
    }

    return { message: 'Favorite removed successfully' };
  }
}
