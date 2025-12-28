import apiClient from './client';
import {
  Restaurant,
  MenuCategory,
  SearchRestaurantsRequest,
  SearchRestaurantsResponse,
  RestaurantCategory,
  GetRestaurantsRequest,
  GetRestaurantsResponse,
} from '@/types/api/restaurant';

class RestaurantService {
  async getRestaurants(params?: GetRestaurantsRequest): Promise<GetRestaurantsResponse> {
    const response = await apiClient.get('/restaurants', { params });
    return response.data;
  }

  async searchRestaurants(params?: SearchRestaurantsRequest): Promise<SearchRestaurantsResponse> {
    const response = await apiClient.get('/restaurants', { params });
    return response.data;
  }

  async getCategories(): Promise<RestaurantCategory[]> {
    const response = await apiClient.get('/restaurants/categories/all');
    return response.data;
  }

  async getRestaurantById(id: string): Promise<Restaurant> {
    const response = await apiClient.get(`/restaurants/${id}`);
    return response.data;
  }

  async getMenu(restaurantId: string): Promise<MenuCategory[]> {
    const response = await apiClient.get(`/restaurants/${restaurantId}/menu`);
    return response.data;
  }
}

export default new RestaurantService();
