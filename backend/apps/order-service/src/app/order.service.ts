import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItem, Order, OrderItem, OrderStatusHistory, MenuItem, Restaurant } from '@backend/database';
import { OrderStatus, CancelledBy } from '@backend/shared';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatusHistory)
    private readonly statusHistoryRepository: Repository<OrderStatusHistory>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) { }

  private async getOrCreateCart(userId: string) {
    let cart = await this.cartRepository.findOne({
      where: { user_id: userId },
      relations: ['items', 'items.menu_item'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        user_id: userId,
        subtotal: 0,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      await this.cartRepository.save(cart);
    }

    return cart;
  }

  async getCart(userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { user_id: userId },
      relations: ['items', 'items.menu_item'],
    });

    if (!cart) {
      throw new RpcException({
        statusCode: 404,
        message: 'Cart not found',
      });
    }

    const response: any = {
      ...cart,
      subtotal: Number(cart.subtotal),
      delivery_fee: 0,
      tax_amount: 0,
      discount_amount: 0,
      total: Number(cart.subtotal),
      items: [],
    };

    if (cart.items && cart.items.length > 0) {
      response.items = cart.items.map(item => ({
        ...item,
        item_name: item.menu_item?.name || 'Unknown Item',
        total_price: Number(item.unit_price) * item.quantity,
        menu_item: item.menu_item ? {
          id: item.menu_item.id,
          name: item.menu_item.name,
          image_url: item.menu_item.image_url,
          price: item.menu_item.price,
        } : null,
      }));
    }

    if (cart.restaurant_id) {
      const restaurant = await this.restaurantRepository.findOne({
        where: { id: cart.restaurant_id },
      });
      if (restaurant) {
        response.restaurant_name = restaurant.name;
      }
    }

    return response;
  }

  async addToCart(userId: string, data: any) {
    try {
      if (!data.menu_item_id) {
        throw new RpcException({
          statusCode: 400,
          message: 'menu_item_id is required',
        });
      }

      if (!data.quantity || data.quantity < 1) {
        throw new RpcException({
          statusCode: 400,
          message: 'quantity must be at least 1',
        });
      }

      const menuItem = await this.menuItemRepository.findOne({
        where: { id: data.menu_item_id },
        relations: ['restaurant'],
      });

      if (!menuItem) {
        throw new RpcException({
          statusCode: 404,
          message: `Menu item with ID ${data.menu_item_id} not found`,
        });
      }

      if (!menuItem.is_available) {
        throw new RpcException({
          statusCode: 400,
          message: 'This menu item is currently unavailable',
        });
      }

      const cart = await this.getOrCreateCart(userId);

      if (cart.restaurant_id && cart.restaurant_id !== menuItem.restaurant_id) {
        const [currentRestaurant, newRestaurant] = await Promise.all([
          this.restaurantRepository.findOne({ where: { id: cart.restaurant_id } }),
          this.restaurantRepository.findOne({ where: { id: menuItem.restaurant_id } }),
        ]);

        throw new RpcException({
          statusCode: 409,
          message: 'Cart already contains items from another restaurant',
          currentRestaurant: {
            id: currentRestaurant?.id,
            name: currentRestaurant?.name,
          },
          newRestaurant: {
            id: newRestaurant?.id,
            name: newRestaurant?.name,
          },
        });
      }

      if (!cart.restaurant_id) {
        cart.restaurant_id = menuItem.restaurant_id;
        await this.cartRepository.save(cart);
      }

      const existingItem = await this.cartItemRepository.findOne({
        where: {
          cart_id: cart.id,
          menu_item_id: data.menu_item_id,
        },
      });

      if (existingItem) {
        existingItem.quantity += data.quantity;
        existingItem.special_instructions = data.special_instructions || existingItem.special_instructions;
        const updated = await this.cartItemRepository.save(existingItem);
        await this.updateCartTotal(cart.id);

        const reloaded = await this.cartItemRepository.findOne({
          where: { id: updated.id },
          relations: ['menu_item'],
        });

        return {
          ...reloaded,
          item_name: reloaded.menu_item?.name || 'Unknown Item',
          total_price: Number(reloaded.unit_price) * reloaded.quantity,
          menu_item: reloaded.menu_item ? {
            id: reloaded.menu_item.id,
            name: reloaded.menu_item.name,
            image_url: reloaded.menu_item.image_url,
            price: reloaded.menu_item.price,
          } : null,
        };
      }

      const cartItem = this.cartItemRepository.create({
        cart_id: cart.id,
        menu_item_id: data.menu_item_id,
        quantity: data.quantity,
        unit_price: menuItem.price,
        selected_options: data.selected_options || null,
        special_instructions: data.special_instructions || null,
      });

      const savedItem = await this.cartItemRepository.save(cartItem);

      await this.updateCartTotal(cart.id);

      const reloaded = await this.cartItemRepository.findOne({
        where: { id: savedItem.id },
        relations: ['menu_item'],
      });

      return {
        ...reloaded,
        item_name: reloaded.menu_item?.name || 'Unknown Item',
        total_price: Number(reloaded.unit_price) * reloaded.quantity,
        menu_item: reloaded.menu_item ? {
          id: reloaded.menu_item.id,
          name: reloaded.menu_item.name,
          image_url: reloaded.menu_item.image_url,
          price: reloaded.menu_item.price,
        } : null,
      };
    } catch (error) {
      console.error('[addToCart] Error:', error);
      throw error;
    }
  }

  async updateCartItem(userId: string, itemId: string, data: any) {
    try {
      const cart = await this.getOrCreateCart(userId);
      const item = await this.cartItemRepository.findOne({
        where: { id: itemId, cart_id: cart.id },
        relations: ['menu_item'],
      });

      if (!item) {
        throw new RpcException({
          statusCode: 404,
          message: 'Cart item not found',
        });
      }

      if (data.quantity !== undefined) {
        if (data.quantity < 1) {
          throw new RpcException({
            statusCode: 400,
            message: 'Quantity must be at least 1',
          });
        }
        item.quantity = data.quantity;
      }

      if (data.special_instructions !== undefined) {
        item.special_instructions = data.special_instructions;
      }

      if (data.selected_options !== undefined) {
        item.selected_options = data.selected_options;
      }

      const updated = await this.cartItemRepository.save(item);

      await this.updateCartTotal(cart.id);

      return {
        ...updated,
        item_name: updated.menu_item?.name || 'Unknown Item',
        total_price: Number(updated.unit_price) * updated.quantity,
        menu_item: updated.menu_item ? {
          id: updated.menu_item.id,
          name: updated.menu_item.name,
          image_url: updated.menu_item.image_url,
          price: updated.menu_item.price,
        } : null,
      };
    } catch (error) {
      console.error('[updateCartItem] Error:', error);
      throw error;
    }
  }

  async removeCartItem(userId: string, itemId: string) {
    try {
      const cart = await this.getOrCreateCart(userId);

      const item = await this.cartItemRepository.findOne({
        where: {
          id: itemId,
          cart_id: cart.id,
        },
      });

      if (!item) {
        throw new RpcException({
          statusCode: 404,
          message: 'Cart item not found',
        });
      }

      await this.cartItemRepository.softDelete({ id: itemId });
      await this.updateCartTotal(cart.id);

      return { message: 'Item removed from cart' };
    } catch (error) {
      console.error('[removeCartItem] Error:', error);
      throw error;
    }
  }

  async clearCart(userId: string) {
    try {
      const cart = await this.getOrCreateCart(userId);

      const items = await this.cartItemRepository.find({
        where: { cart_id: cart.id },
      });

      if (items.length > 0) {
        const itemIds = items.map(item => item.id);
        await this.cartItemRepository.softDelete(itemIds);
      }

      cart.subtotal = 0;
      cart.restaurant_id = null;
      await this.cartRepository.save(cart);

      return { message: 'Cart cleared' };
    } catch (error) {
      console.error('[clearCart] Error:', error);
      throw error;
    }
  }

  async createOrder(userId: string, data: any) {
    const cart = await this.cartRepository.findOne({
      where: { user_id: userId },
      relations: ['items'],
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = this.orderRepository.create({
      order_number: orderNumber,
      user_id: userId,
      restaurant_id: cart.restaurant_id,
      delivery_address_id: data.delivery_address_id,
      status: OrderStatus.PENDING,
      subtotal: cart.subtotal,
      delivery_fee: data.delivery_fee || 0,
      discount_amount: data.discount_amount || 0,
      total_amount: cart.subtotal + (data.delivery_fee || 0) - (data.discount_amount || 0),
      payment_method: data.payment_method,
      voucher_id: data.voucher_id,
      special_instructions: data.special_instructions,
      estimated_delivery: new Date(Date.now() + 45 * 60 * 1000),
    });

    const savedOrder = await this.orderRepository.save(order);

    for (const cartItem of cart.items) {
      const orderItem = this.orderItemRepository.create({
        order_id: savedOrder.id,
        menu_item_id: cartItem.menu_item_id,
        item_name: 'Menu Item',
        quantity: cartItem.quantity,
        unit_price: cartItem.unit_price,
        total_price: cartItem.unit_price * cartItem.quantity,
        selected_options: cartItem.selected_options,
        special_instructions: cartItem.special_instructions,
      });
      await this.orderItemRepository.save(orderItem);
    }

    await this.clearCart(userId);

    return savedOrder;
  }

  async getUserOrders(userId: string, query: any) {
    const { status, page = 1, limit = 20 } = query;

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.menu_item', 'menuItem')
      .where('order.user_id = :userId', { userId })

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    const total = await queryBuilder.getCount();

    queryBuilder
      .orderBy('order.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const data = await queryBuilder.getMany();

    return {
      data,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async getOrder(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: {
        items: {
          menu_item: true,
        },
      },
    });
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async cancelOrder(orderId: string, userId: string, data: any) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user_id: userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot cancel this order');
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelled_at = new Date();
    order.cancellation_reason = data.cancellation_reason;
    order.cancelled_by = data.cancelled_by || CancelledBy.CUSTOMER;

    return this.orderRepository.save(order);
  }

  async reorder(userId: string, orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user_id: userId },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.clearCart(userId);

    const cart = await this.getOrCreateCart(userId);

    cart.restaurant_id = order.restaurant_id;
    await this.cartRepository.save(cart);

    for (const item of order.items) {
      const menuItem = await this.menuItemRepository.findOne({
        where: { id: item.menu_item_id },
      });

      if (!menuItem) {
        console.warn(`Menu item ${item.menu_item_id} not found, skipping`);
        continue;
      }

      if (!menuItem.is_available) {
        console.warn(`Menu item ${item.menu_item_id} is not available, skipping`);
        continue;
      }

      const cartItem = this.cartItemRepository.create({
        cart_id: cart.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: menuItem.price,
        selected_options: item.selected_options || null,
        special_instructions: item.special_instructions || null,
      });

      await this.cartItemRepository.save(cartItem);
    }

    await this.updateCartTotal(cart.id);

    return { message: 'Items added to cart' };
  }

  async getRestaurantOrders(restaurantId: string, query: any) {
    const { status, page = 1, limit = 20 } = query;

    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .where('order.restaurant_id = :restaurantId', { restaurantId });

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    const total = await queryBuilder.getCount();

    queryBuilder
      .orderBy('order.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const data = await queryBuilder.getMany();

    return {
      data,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async updateOrderStatus(orderId: string, data: any) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const previousStatus = order.status;
    order.status = data.status;

    if (data.status === OrderStatus.DELIVERED) {
      order.actual_delivery = new Date();
    }

    await this.orderRepository.save(order);

    await this.statusHistoryRepository.save({
      order_id: orderId,
      previous_status: previousStatus,
      new_status: data.status,
      changed_by: data.changed_by,
      note: data.note,
    });

    return order;
  }

  private async updateCartTotal(cartId: string) {
    const items = await this.cartItemRepository.find({
      where: { cart_id: cartId },
    });

    const subtotal = items.reduce((sum, item) => {
      const itemTotal = Number(item.unit_price) * item.quantity;
      return sum + itemTotal;
    }, 0);

    if (items.length === 0) {
      await this.cartRepository.update(cartId, { subtotal: 0, restaurant_id: null });
    } else {
      await this.cartRepository.update(cartId, { subtotal });
    }
  }
}
