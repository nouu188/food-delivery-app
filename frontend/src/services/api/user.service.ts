import apiClient from './client';
import {
  UserProfile,
  UpdateProfileRequest,
  UserAddress,
  CreateAddressRequest,
  UpdateAddressRequest,
  RegisterDeviceRequest,
  FavoriteRestaurant,
  GetFavoritesResponse
} from '@/types/api/user';

class UserService {
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get('/users/me');
    return response.data;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await apiClient.put('/users/me', data);
    return response.data;
  }

  async getAddresses(): Promise<UserAddress[]> {
    const response = await apiClient.get('/users/addresses');
    return response.data;
  }

  async createAddress(data: CreateAddressRequest): Promise<UserAddress> {
    const response = await apiClient.post('/users/addresses', data);
    return response.data;
  }

  async updateAddress(id: string, data: UpdateAddressRequest): Promise<UserAddress> {
    const response = await apiClient.put(`/users/addresses/${id}`, data);
    return response.data;
  }

  async deleteAddress(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/users/addresses/${id}`);
    return response.data;
  }

  async registerDevice(data: RegisterDeviceRequest): Promise<any> {
    const response = await apiClient.put('/users/devices', data);
    return response.data;
  }

  async getFavorites(): Promise<GetFavoritesResponse> {
    const response = await apiClient.get('/users/favorites');
    return response.data;
  }

  async addFavorite(restaurantId: string): Promise<FavoriteRestaurant> {
    const response = await apiClient.post(`/users/favorites/${restaurantId}`);
    return response.data;
  }

  async removeFavorite(restaurantId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/users/favorites/${restaurantId}`);
    return response.data;
  }
}

export default new UserService();
