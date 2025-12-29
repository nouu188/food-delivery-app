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
  HttpException,
  HttpStatus,
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
    try {
      return await firstValueFrom(this.orderService.send(ORDER_PATTERNS.GET_CART, { userId: req.user.id }));
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Cart not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get cart',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal order error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('cart/items')
  @UseGuards(JwtAuthGuard)
  async addToCart(@Request() req: AuthenticatedRequest, @Body() data: AddToCartDto) {
    try {
      return await firstValueFrom(
        this.orderService.send(ORDER_PATTERNS.ADD_TO_CART, {
          userId: req.user.id,
          ...data,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 409) {
        throw new HttpException(
          errorData.message || 'Cart already contains items from another restaurant',
          HttpStatus.CONFLICT,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid cart item data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to add to cart',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal order error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('cart/items/:id')
  @UseGuards(JwtAuthGuard)
  async updateCartItem(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: UpdateCartItemDto
  ) {
    try {
      return await firstValueFrom(
        this.orderService.send(ORDER_PATTERNS.UPDATE_CART_ITEM, {
          userId: req.user.id,
          itemId: id,
          ...data,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Cart item not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid cart item data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to update cart item',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal order error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('cart/items/:id')
  @UseGuards(JwtAuthGuard)
  async removeCartItem(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.orderService.send(ORDER_PATTERNS.REMOVE_FROM_CART, {
          userId: req.user.id,
          itemId: id,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Cart item not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to remove cart item',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal order error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('cart')
  @UseGuards(JwtAuthGuard)
  async clearCart(@Request() req: AuthenticatedRequest) {
    try {
      return await firstValueFrom(
        this.orderService.send(ORDER_PATTERNS.CLEAR_CART, { userId: req.user.id })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to clear cart',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal order error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('orders')
  @UseGuards(JwtAuthGuard)
  async createOrder(@Request() req: AuthenticatedRequest, @Body() data: CreateOrderDto) {
    try {
      return await firstValueFrom(
        this.orderService.send(ORDER_PATTERNS.CREATE_ORDER, {
          userId: req.user.id,
          ...data,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid order data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Resource not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to create order',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal order error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  async getUserOrders(@Request() req: AuthenticatedRequest, @Query() query: OrderQueryDto) {
    try {
      return await firstValueFrom(
        this.orderService.send(ORDER_PATTERNS.GET_ORDERS, {
          userId: req.user.id,
          ...query,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get orders',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal order error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Param('id') id: string) {
    try {
      return await firstValueFrom(this.orderService.send(ORDER_PATTERNS.GET_ORDER, { id }));
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Order not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get order',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal order error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('orders/:id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: CancelOrderDto
  ) {
    try {
      return await firstValueFrom(
        this.orderService.send(ORDER_PATTERNS.CANCEL_ORDER, {
          id,
          userId: req.user.id,
          ...data,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Order not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Cannot cancel order',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to cancel this order',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to cancel order',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal order error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('orders/:id/reorder')
  @UseGuards(JwtAuthGuard)
  async reorder(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.orderService.send(ORDER_PATTERNS.REORDER, {
          userId: req.user.id,
          orderId: id,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Order not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Cannot reorder',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to reorder',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal order error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('restaurants/:id/orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async getRestaurantOrders(@Param('id') id: string, @Query() query: OrderQueryDto) {
    try {
      return await firstValueFrom(
        this.orderService.send(ORDER_PATTERNS.GET_RESTAURANT_ORDERS, {
          restaurantId: id,
          ...query,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Restaurant not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to view restaurant orders',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get restaurant orders',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal order error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('orders/:id/status')
  @UseGuards(JwtAuthGuard)
  async updateOrderStatus(@Param('id') id: string, @Body() data: UpdateOrderStatusDto) {
    try {
      return await firstValueFrom(
        this.orderService.send(ORDER_PATTERNS.UPDATE_ORDER_STATUS, {
          id,
          ...data,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Order not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid status update',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to update order status',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to update order status',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal order error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
