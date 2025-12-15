import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { JwtAuthGuard, Roles, RolesGuard } from '@backend/common';
import { UserRole } from '@backend/shared';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('cart')
  @MessagePattern('order.get-cart')
  @UseGuards(JwtAuthGuard)
  async getCart(@Request() req: any) {
    return this.orderService.getCart(req.user.id);
  }

  @Post('cart/items')
  @MessagePattern('order.add-to-cart')
  @UseGuards(JwtAuthGuard)
  async addToCart(@Request() req: any, @Body() data: any) {
    return this.orderService.addToCart(req.user.id, data);
  }

  @Put('cart/items/:id')
  @MessagePattern('order.update-cart-item')
  @UseGuards(JwtAuthGuard)
  async updateCartItem(@Request() req: any, @Param('id') id: string, @Body() data: any) {
    return this.orderService.updateCartItem(req.user.id, id, data);
  }

  @Delete('cart/items/:id')
  @MessagePattern('order.remove-cart-item')
  @UseGuards(JwtAuthGuard)
  async removeCartItem(@Request() req: any, @Param('id') id: string) {
    return this.orderService.removeCartItem(req.user.id, id);
  }

  @Delete('cart')
  @MessagePattern('order.clear-cart')
  @UseGuards(JwtAuthGuard)
  async clearCart(@Request() req: any) {
    return this.orderService.clearCart(req.user.id);
  }

  @Post('orders')
  @MessagePattern('order.create')
  @UseGuards(JwtAuthGuard)
  async createOrder(@Request() req: any, @Body() data: any) {
    return this.orderService.createOrder(req.user.id, data);
  }

  @Get('orders')
  @MessagePattern('order.get-user-orders')
  @UseGuards(JwtAuthGuard)
  async getUserOrders(@Request() req: any, @Query() query: any) {
    return this.orderService.getUserOrders(req.user.id, query);
  }

  @Get('orders/:id')
  @MessagePattern('order.get-one')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOrder(id);
  }

  @Put('orders/:id/cancel')
  @MessagePattern('order.cancel')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(@Request() req: any, @Param('id') id: string, @Body() data: any) {
    return this.orderService.cancelOrder(id, req.user.id, data);
  }

  @Post('orders/:id/reorder')
  @MessagePattern('order.reorder')
  @UseGuards(JwtAuthGuard)
  async reorder(@Request() req: any, @Param('id') id: string) {
    return this.orderService.reorder(req.user.id, id);
  }

  @Get('restaurants/:id/orders')
  @MessagePattern('order.get-restaurant-orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async getRestaurantOrders(@Param('id') id: string, @Query() query: any) {
    return this.orderService.getRestaurantOrders(id, query);
  }

  @Put('orders/:id/status')
  @MessagePattern('order.update-status')
  @UseGuards(JwtAuthGuard)
  async updateOrderStatus(@Param('id') id: string, @Body() data: any) {
    return this.orderService.updateOrderStatus(id, data);
  }
}
