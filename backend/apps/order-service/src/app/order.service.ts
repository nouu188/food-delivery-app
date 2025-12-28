import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItem, Order, OrderItem, OrderStatusHistory, MenuItem, Restaurant, Voucher, VoucherUsage } from '@backend/database';
import { OrderStatus, CancelledBy, DiscountType } from '@backend/shared';

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
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
    @InjectRepository(VoucherUsage)
    private readonly voucherUsageRepository: Repository<VoucherUsage>,
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
      relations: ['items', 'items.menu_item'],
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const TAX_RATE = 0.10;
    const subtotal = Number(cart.subtotal);
    const deliveryFee = Number(data.delivery_fee || 0);
    const taxAmount = Number((subtotal * TAX_RATE));

    // Validate and apply voucher if provided
    let voucher: Voucher | null = null;
    let discountAmount = 0;

    if (data.voucher_code) {
      const voucherValidation = await this.validateAndApplyVoucher(
        data.voucher_code,
        userId,
        cart.restaurant_id,
        subtotal + deliveryFee + taxAmount
      );

      if (voucherValidation.isValid && voucherValidation.voucher) {
        voucher = voucherValidation.voucher;
        discountAmount = voucherValidation.discountAmount;
      } else {
        throw new BadRequestException(voucherValidation.message || 'Invalid voucher');
      }
    }

    const totalAmount = subtotal + deliveryFee + taxAmount - discountAmount;

    const order = this.orderRepository.create({
      order_number: orderNumber,
      user_id: userId,
      restaurant_id: cart.restaurant_id,
      delivery_address_id: data.delivery_address_id,
      status: OrderStatus.PENDING,
      subtotal: subtotal,
      delivery_fee: deliveryFee,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      payment_method: data.payment_method,
      voucher_id: voucher?.id || null,
      special_instructions: data.special_instructions,
      estimated_delivery: new Date(Date.now() + 45 * 60 * 1000),
    });

    const savedOrder = await this.orderRepository.save(order);

    for (const cartItem of cart.items) {
      const itemName = cartItem.menu_item?.name || 'Menu Item';

      const orderItem = this.orderItemRepository.create({
        order_id: savedOrder.id,
        menu_item_id: cartItem.menu_item_id,
        item_name: itemName,
        quantity: cartItem.quantity,
        unit_price: cartItem.unit_price,
        total_price: cartItem.unit_price * cartItem.quantity,
        selected_options: cartItem.selected_options,
        special_instructions: cartItem.special_instructions,
      });
      await this.orderItemRepository.save(orderItem);
    }

    // Track voucher usage if voucher was applied
    if (voucher) {
      await this.trackVoucherUsage(voucher.id, userId, savedOrder.id, discountAmount);
    }

    await this.clearCart(userId);

    return this.getOrder(savedOrder.id);
  }

  async getUserOrders(userId: string, query: any) {
    const { status, page = 1, limit = 20 } = query;

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.menu_item', 'menuItem')
      .leftJoinAndSelect('order.restaurant', 'restaurant')
      .leftJoinAndSelect('order.delivery_address', 'delivery_address')
      .leftJoinAndSelect('order.voucher', 'voucher')
      .where('order.user_id = :userId', { userId })

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    const total = await queryBuilder.getCount();

    queryBuilder
      .orderBy('order.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const orders = await queryBuilder.getMany();

    const data = orders.map(order => this.transformOrderResponse(order));

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
        restaurant: true,
        delivery_address: true,
        voucher: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.transformOrderResponse(order);
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

  private transformOrderResponse(order: any) {
    const response: any = {
      id: order.id,
      order_number: order.order_number,
      user_id: order.user_id,
      restaurant_id: order.restaurant_id,
      delivery_address_id: order.delivery_address_id,
      status: order.status,
      subtotal: Number(order.subtotal),
      delivery_fee: Number(order.delivery_fee || 0),
      tax_amount: Number(order.tax_amount || 0),
      discount_amount: Number(order.discount_amount || 0),
      total_amount: Number(order.total_amount),
      payment_method: order.payment_method,
      special_instructions: order.special_instructions,
      estimated_delivery: order.estimated_delivery,
      actual_delivery: order.actual_delivery,
      cancelled_at: order.cancelled_at,
      cancellation_reason: order.cancellation_reason,
      cancelled_by: order.cancelled_by,
      created_at: order.created_at,
      updated_at: order.updated_at,
    };

    if (order.restaurant) {
      response.restaurant_name = order.restaurant.name;
      response.restaurant_phone = order.restaurant.phone;
      response.restaurant_address = order.restaurant.address;
    }

    if (order.delivery_address) {
      response.delivery_address = {
        id: order.delivery_address.id,
        label: order.delivery_address.label,
        address_line: order.delivery_address.address_line,
        ward: order.delivery_address.ward,
        district: order.delivery_address.district,
        city: order.delivery_address.city,
        latitude: order.delivery_address.latitude,
        longitude: order.delivery_address.longitude,
        delivery_note: order.delivery_address.delivery_note,
      };
    }

    if (order.voucher) {
      response.voucher_id = order.voucher.id;
      response.voucher_code = order.voucher.code;
    }

    if (order.items && Array.isArray(order.items)) {
      response.items = order.items.map((item: any) => ({
        id: item.id,
        order_id: item.order_id,
        menu_item_id: item.menu_item_id,
        item_name: item.item_name,
        quantity: item.quantity,
        unit_price: Number(item.unit_price),
        total_price: Number(item.total_price),
        selected_options: item.selected_options,
        special_instructions: item.special_instructions,
        menu_item: item.menu_item ? {
          id: item.menu_item.id,
          name: item.menu_item.name,
          image_url: item.menu_item.image_url,
          price: Number(item.menu_item.price),
        } : null,
      }));
    }

    return response;
  }

  private async validateAndApplyVoucher(
    code: string,
    userId: string,
    restaurantId: string,
    orderAmount: number
  ): Promise<{ isValid: boolean; voucher?: Voucher; discountAmount: number; message?: string }> {
    // Find voucher by code
    const voucher = await this.voucherRepository.findOne({
      where: { code, is_active: true },
      relations: ['restaurant'],
    });

    if (!voucher) {
      return {
        isValid: false,
        discountAmount: 0,
        message: 'Voucher not found or inactive',
      };
    }

    // Check validity period
    const now = new Date();
    if (voucher.valid_from > now || voucher.valid_until < now) {
      return {
        isValid: false,
        discountAmount: 0,
        message: 'Voucher is expired or not yet valid',
      };
    }

    // Check restaurant restriction
    if (voucher.restaurant_id && voucher.restaurant_id !== restaurantId) {
      return {
        isValid: false,
        discountAmount: 0,
        message: 'Voucher is not valid for this restaurant',
      };
    }

    // Check minimum order amount
    if (Number(voucher.min_order_amount) > orderAmount) {
      return {
        isValid: false,
        discountAmount: 0,
        message: `Minimum order amount is $${voucher.min_order_amount}`,
      };
    }

    // Check global usage limit
    if (voucher.usage_limit && voucher.usage_count >= voucher.usage_limit) {
      return {
        isValid: false,
        discountAmount: 0,
        message: 'Voucher usage limit reached',
      };
    }

    // Check per-user usage limit
    const userUsageCount = await this.voucherUsageRepository.count({
      where: { voucher_id: voucher.id, user_id: userId },
    });

    if (userUsageCount >= voucher.per_user_limit) {
      return {
        isValid: false,
        discountAmount: 0,
        message: 'You have reached the usage limit for this voucher',
      };
    }

    // Calculate discount amount
    let discountAmount = 0;

    if (voucher.discount_type === DiscountType.PERCENTAGE) {
      discountAmount = (orderAmount * Number(voucher.discount_value)) / 100;
      if (voucher.max_discount) {
        discountAmount = Math.min(discountAmount, Number(voucher.max_discount));
      }
    } else if (voucher.discount_type === DiscountType.FIXED_AMOUNT) {
      discountAmount = Number(voucher.discount_value);
    } else if (voucher.discount_type === DiscountType.FREE_DELIVERY) {
      // For free delivery, discount should be handled separately
      // For now, we'll set it to 0 and handle in delivery_fee logic if needed
      discountAmount = 0;
    }

    // Round to 2 decimal places
    discountAmount = Math.round(discountAmount * 100) / 100;

    return {
      isValid: true,
      voucher,
      discountAmount,
    };
  }

  private async trackVoucherUsage(
    voucherId: string,
    userId: string,
    orderId: string,
    discountApplied: number
  ): Promise<void> {
    // Increment voucher usage count
    await this.voucherRepository.increment({ id: voucherId }, 'usage_count', 1);

    // Create usage record
    const usage = this.voucherUsageRepository.create({
      voucher_id: voucherId,
      user_id: userId,
      order_id: orderId,
      discount_applied: discountApplied,
    });

    await this.voucherUsageRepository.save(usage);
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
