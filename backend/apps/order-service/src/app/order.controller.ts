import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { JwtAuthGuard, Roles, RolesGuard } from '@backend/common';
import { UserRole } from '@backend/shared';
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

  @Get('cart')
  @MessagePattern(ORDER_PATTERNS.GET_CART)
  @UseGuards(JwtAuthGuard)
  async getCart(@Request() req: any) {
    return this.orderService.getCart(req.user.id);
  }

  @Post('cart/items')
  @MessagePattern(ORDER_PATTERNS.ADD_TO_CART)
  @UseGuards(JwtAuthGuard)
  async addToCart(@Request() req: any, @Body() data: any) {
    return this.orderService.addToCart(req.user.id, data);
  }

  @Put('cart/items/:id')
  @MessagePattern(ORDER_PATTERNS.UPDATE_CART_ITEM)
  @UseGuards(JwtAuthGuard)
  async updateCartItem(@Request() req: any, @Param('id') id: string, @Body() data: any) {
    return this.orderService.updateCartItem(req.user.id, id, data);
  }

  @Delete('cart/items/:id')
  @MessagePattern(ORDER_PATTERNS.REMOVE_FROM_CART)
  @UseGuards(JwtAuthGuard)
  async removeCartItem(@Request() req: any, @Param('id') id: string) {
    return this.orderService.removeCartItem(req.user.id, id);
  }

  @Delete('cart')
  @MessagePattern(ORDER_PATTERNS.CLEAR_CART)
  @UseGuards(JwtAuthGuard)
  async clearCart(@Request() req: any) {
    return this.orderService.clearCart(req.user.id);
  }

  @Post('orders')
  @MessagePattern(ORDER_PATTERNS.CREATE_ORDER)
  @UseGuards(JwtAuthGuard)
  async createOrder(@Request() req: any, @Body() data: any) {
    return this.orderService.createOrder(req.user.id, data);
  }

  @Get('orders')
  @MessagePattern(ORDER_PATTERNS.GET_ORDERS)
  @UseGuards(JwtAuthGuard)
  async getUserOrders(@Request() req: any, @Query() query: any) {
    return this.orderService.getUserOrders(req.user.id, query);
  }

  @Get('orders/:id')
  @MessagePattern(ORDER_PATTERNS.GET_ORDER)
  @UseGuards(JwtAuthGuard)
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOrder(id);
  }

  @Put('orders/:id/cancel')
  @MessagePattern(ORDER_PATTERNS.CANCEL_ORDER)
  @UseGuards(JwtAuthGuard)
  async cancelOrder(@Request() req: any, @Param('id') id: string, @Body() data: any) {
    return this.orderService.cancelOrder(id, req.user.id, data);
  }

  @Post('orders/:id/reorder')
  @MessagePattern(ORDER_PATTERNS.REORDER)
  @UseGuards(JwtAuthGuard)
  async reorder(@Request() req: any, @Param('id') id: string) {
    return this.orderService.reorder(req.user.id, id);
  }

  @Get('restaurants/:id/orders')
  @MessagePattern(ORDER_PATTERNS.GET_RESTAURANT_ORDERS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async getRestaurantOrders(@Param('id') id: string, @Query() query: any) {
    return this.orderService.getRestaurantOrders(id, query);
  }

  @Put('orders/:id/status')
  @MessagePattern(ORDER_PATTERNS.UPDATE_ORDER_STATUS)
  @UseGuards(JwtAuthGuard)
  async updateOrderStatus(@Param('id') id: string, @Body() data: any) {
    return this.orderService.updateOrderStatus(id, data);
  }
}
