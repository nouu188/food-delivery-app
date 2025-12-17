import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItem, Order, OrderItem, OrderStatusHistory } from '@backend/database';
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
  ) {}

  async getCart(userId: string) {
    let cart = await this.cartRepository.findOne({
      where: { user_id: userId },
      relations: ['items'],
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

  async addToCart(userId: string, data: any) {
    const cart = await this.getCart(userId);

    if (cart.restaurant_id && cart.restaurant_id !== data.restaurant_id) {
      throw new BadRequestException('Cart already contains items from another restaurant');
    }

    if (!cart.restaurant_id) {
      cart.restaurant_id = data.restaurant_id;
      await this.cartRepository.save(cart);
    }

    const cartItem = this.cartItemRepository.create({
      cart_id: cart.id,
      menu_item_id: data.menu_item_id,
      quantity: data.quantity,
      unit_price: data.unit_price,
      selected_options: data.selected_options || [],
      special_instructions: data.special_instructions,
    });

    const savedItem = await this.cartItemRepository.save(cartItem);

    await this.updateCartTotal(cart.id);

    return savedItem;
  }

  async updateCartItem(userId: string, itemId: string, data: any) {
    const cart = await this.getCart(userId);
    const item = await this.cartItemRepository.findOne({
      where: { id: itemId, cart_id: cart.id },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    Object.assign(item, data);
    const updated = await this.cartItemRepository.save(item);

    await this.updateCartTotal(cart.id);

    return updated;
  }

  async removeCartItem(userId: string, itemId: string) {
    const cart = await this.getCart(userId);
    const result = await this.cartItemRepository.delete({
      id: itemId,
      cart_id: cart.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Cart item not found');
    }

    await this.updateCartTotal(cart.id);

    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    await this.cartItemRepository.delete({ cart_id: cart.id });
    cart.subtotal = 0;
    cart.restaurant_id = null;
    await this.cartRepository.save(cart);

    return { message: 'Cart cleared' };
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

    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .where('order.user_id = :userId', { userId });

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
      relations: ['items'],
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

    for (const item of order.items) {
      await this.addToCart(userId, {
        restaurant_id: order.restaurant_id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        selected_options: item.selected_options,
        special_instructions: item.special_instructions,
      });
    }

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

    const subtotal = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

    await this.cartRepository.update(cartId, { subtotal });
  }
}
