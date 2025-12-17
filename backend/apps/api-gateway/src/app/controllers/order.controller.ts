import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard, Roles, RolesGuard, AuthenticatedRequest } from '@backend/common';
import {
  UserRole,
  AddToCartDto,
  UpdateCartItemDto,
  CreateOrderDto,
  OrderQueryDto,
  CancelOrderDto,
  UpdateOrderStatusDto,
} from '@backend/shared';
import { ORDER_PATTERNS } from '@backend/contracts';

@Controller()
export class OrderController {
  constructor(@Inject('ORDER_SERVICE') private readonly orderService: ClientProxy) {}

  @Get('cart')
  @UseGuards(JwtAuthGuard)
  async getCart(@Request() req: AuthenticatedRequest) {
    return firstValueFrom(this.orderService.send(ORDER_PATTERNS.GET_CART, { userId: req.user.id }));
  }

  @Post('cart/items')
  @UseGuards(JwtAuthGuard)
  async addToCart(@Request() req: AuthenticatedRequest, @Body() data: AddToCartDto) {
    return firstValueFrom(
      this.orderService.send(ORDER_PATTERNS.ADD_TO_CART, {
        userId: req.user.id,
        ...data,
      })
    );
  }

  @Put('cart/items/:id')
  @UseGuards(JwtAuthGuard)
  async updateCartItem(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: UpdateCartItemDto
  ) {
    return firstValueFrom(
      this.orderService.send(ORDER_PATTERNS.UPDATE_CART_ITEM, {
        userId: req.user.id,
        itemId: id,
        ...data,
      })
    );
  }

  @Delete('cart/items/:id')
  @UseGuards(JwtAuthGuard)
  async removeCartItem(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return firstValueFrom(
      this.orderService.send(ORDER_PATTERNS.REMOVE_FROM_CART, {
        userId: req.user.id,
        itemId: id,
      })
    );
  }

  @Delete('cart')
  @UseGuards(JwtAuthGuard)
  async clearCart(@Request() req: AuthenticatedRequest) {
    return firstValueFrom(
      this.orderService.send(ORDER_PATTERNS.CLEAR_CART, { userId: req.user.id })
    );
  }

  @Post('orders')
  @UseGuards(JwtAuthGuard)
  async createOrder(@Request() req: AuthenticatedRequest, @Body() data: CreateOrderDto) {
    return firstValueFrom(
      this.orderService.send(ORDER_PATTERNS.CREATE_ORDER, {
        userId: req.user.id,
        ...data,
      })
    );
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  async getUserOrders(@Request() req: AuthenticatedRequest, @Query() query: OrderQueryDto) {
    return firstValueFrom(
      this.orderService.send(ORDER_PATTERNS.GET_ORDERS, {
        userId: req.user.id,
        ...query,
      })
    );
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Param('id') id: string) {
    return firstValueFrom(this.orderService.send(ORDER_PATTERNS.GET_ORDER, { id }));
  }

  @Put('orders/:id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: CancelOrderDto
  ) {
    return firstValueFrom(
      this.orderService.send(ORDER_PATTERNS.CANCEL_ORDER, {
        id,
        userId: req.user.id,
        ...data,
      })
    );
  }

  @Post('orders/:id/reorder')
  @UseGuards(JwtAuthGuard)
  async reorder(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return firstValueFrom(
      this.orderService.send(ORDER_PATTERNS.REORDER, {
        userId: req.user.id,
        orderId: id,
      })
    );
  }

  @Get('restaurants/:id/orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async getRestaurantOrders(@Param('id') id: string, @Query() query: OrderQueryDto) {
    return firstValueFrom(
      this.orderService.send(ORDER_PATTERNS.GET_RESTAURANT_ORDERS, {
        restaurantId: id,
        ...query,
      })
    );
  }

  @Put('orders/:id/status')
  @UseGuards(JwtAuthGuard)
  async updateOrderStatus(@Param('id') id: string, @Body() data: UpdateOrderStatusDto) {
    return firstValueFrom(
      this.orderService.send(ORDER_PATTERNS.UPDATE_ORDER_STATUS, {
        id,
        ...data,
      })
    );
  }
}
