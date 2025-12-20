import apiClient from './client';
import {
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
  CreateOrderRequest,
  Order,
  GetOrdersRequest,
  GetOrdersResponse,
  CancelOrderRequest,
  CartItem,
} from '@/types/api/order';

class OrderService {
  async getCart(): Promise<Cart> {
    const response = await apiClient.get('/cart');
    return response.data;
  }

  async addToCart(data: AddToCartRequest): Promise<Cart> {
    const response = await apiClient.post('/cart/items', data);
    return response.data;
  }

  async updateCartItem(itemId: string, data: UpdateCartItemRequest): Promise<CartItem> {
    const response = await apiClient.put(`/cart/items/${itemId}`, data);
    return response.data;
  }

  async removeCartItem(itemId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/cart/items/${itemId}`);
    return response.data;
  }

  async clearCart(): Promise<{ message: string }> {
    const response = await apiClient.delete('/cart');
    return response.data;
  }

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post('/orders', data);
    return response.data;
  }

  async getOrders(params?: GetOrdersRequest): Promise<GetOrdersResponse> {
    const response = await apiClient.get('/orders', { params });
    return response.data;
  }

  async getOrderById(id: string): Promise<Order> {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  }

  async cancelOrder(id: string, data: CancelOrderRequest): Promise<Order> {
    const response = await apiClient.put(`/orders/${id}/cancel`, data);
    return response.data;
  }

  async reorder(id: string): Promise<Order> {
    const response = await apiClient.post(`/orders/${id}/reorder`);
    return response.data;
  }
}

export default new OrderService();
