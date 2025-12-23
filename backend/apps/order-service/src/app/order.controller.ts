import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { ORDER_PATTERNS } from '@backend/contracts';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'order-service',
      timestamp: new Date().toISOString(),
    };
  }

  @MessagePattern(ORDER_PATTERNS.GET_CART)
  async getCart(data: { userId: string }) {
    return this.orderService.getCart(data.userId);
  }

  @MessagePattern(ORDER_PATTERNS.ADD_TO_CART)
  async addToCart(data: any) {
    return this.orderService.addToCart(data.userId, data);
  }

  @MessagePattern(ORDER_PATTERNS.UPDATE_CART_ITEM)
  async updateCartItem(data: any) {
    return this.orderService.updateCartItem(data.userId, data.id, data);
  }

  @MessagePattern(ORDER_PATTERNS.REMOVE_FROM_CART)
  async removeCartItem(data: { userId: string; id: string }) {
    return this.orderService.removeCartItem(data.userId, data.id);
  }

  @MessagePattern(ORDER_PATTERNS.CLEAR_CART)
  async clearCart(data: { userId: string }) {
    return this.orderService.clearCart(data.userId);
  }

  @MessagePattern(ORDER_PATTERNS.CREATE_ORDER)
  async createOrder(data: any) {
    return this.orderService.createOrder(data.userId, data);
  }

  @MessagePattern(ORDER_PATTERNS.GET_ORDERS)
  async getUserOrders(data: any) {
    return this.orderService.getUserOrders(data.userId, data);
  }

  @MessagePattern(ORDER_PATTERNS.GET_ORDER)
  async getOrder(data: { id: string }) {
    return this.orderService.getOrder(data.id);
  }

  @MessagePattern(ORDER_PATTERNS.CANCEL_ORDER)
  async cancelOrder(data: any) {
    return this.orderService.cancelOrder(data.id, data.userId, data);
  }

  @MessagePattern(ORDER_PATTERNS.REORDER)
  async reorder(data: { userId: string; id: string }) {
    return this.orderService.reorder(data.userId, data.id);
  }

  @MessagePattern(ORDER_PATTERNS.GET_RESTAURANT_ORDERS)
  async getRestaurantOrders(data: any) {
    return this.orderService.getRestaurantOrders(data.id, data);
  }

  @MessagePattern(ORDER_PATTERNS.UPDATE_ORDER_STATUS)
  async updateOrderStatus(data: any) {
    return this.orderService.updateOrderStatus(data.id, data);
  }
}
