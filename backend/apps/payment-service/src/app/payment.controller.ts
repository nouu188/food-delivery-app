import { Controller, Get } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { PaymentService } from './payment.service';
import { PAYMENT_PATTERNS, ORDER_EVENTS, OrderCreatedPayload, OrderCancelledPayload } from '@backend/contracts';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'payment-service',
      timestamp: new Date().toISOString(),
    };
  }

  @MessagePattern(PAYMENT_PATTERNS.PROCESS_PAYMENT)
  async processPayment(data: any) {
    return this.paymentService.processPayment(data.order_id, data.userId, data.amount, data.method);
  }

  @MessagePattern(PAYMENT_PATTERNS.GET_PAYMENT_DETAILS)
  async getPaymentDetails(data: { id: string }) {
    return this.paymentService.getPaymentDetails(data.id);
  }

  @MessagePattern(PAYMENT_PATTERNS.PROCESS_REFUND)
  async refundPayment(data: any) {
    return this.paymentService.refundPayment(data.id, data.refund_amount, data.refund_reason);
  }

  @MessagePattern(PAYMENT_PATTERNS.GET_WALLET)
  async getWallet(data: { userId: string }) {
    return this.paymentService.getWallet(data.userId);
  }

  @MessagePattern(PAYMENT_PATTERNS.TOP_UP_WALLET)
  async topUpWallet(data: any) {
    return this.paymentService.topUpWallet(data.userId, data.amount, data.payment_method);
  }

  @MessagePattern(PAYMENT_PATTERNS.GET_WALLET_TRANSACTIONS)
  async getWalletTransactions(data: any) {
    return this.paymentService.getWalletTransactions(data.userId, data.type, data.page, data.limit);
  }

  @EventPattern(ORDER_EVENTS.CREATED)
  async handleOrderCreated(data: OrderCreatedPayload) {
    return this.paymentService.processPayment(data.orderId, data.userId, data.totalAmount, data.paymentMethod);
  }

  @EventPattern(ORDER_EVENTS.CANCELLED)
  async handleOrderCancelled(data: OrderCancelledPayload) {
    const payment = await this.paymentService.getPaymentByOrderId(data.orderId);
    if (payment && payment.status === 'COMPLETED') {
      await this.paymentService.refundPayment(payment.id, payment.amount, 'Order cancelled');
    }
  }
}
