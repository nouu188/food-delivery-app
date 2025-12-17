import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { PaymentService } from './payment.service';
import { JwtAuthGuard, AuthenticatedRequest } from '@backend/common';
import { ProcessPaymentDto, RefundPaymentDto, TopUpWalletDto, WalletTransactionQueryDto } from '@backend/shared';
import { PAYMENT_PATTERNS, ORDER_EVENTS, OrderCreatedPayload, OrderCancelledPayload } from '@backend/contracts';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('process')
  @MessagePattern(PAYMENT_PATTERNS.PROCESS_PAYMENT)
  @UseGuards(JwtAuthGuard)
  async processPayment(@Request() req: AuthenticatedRequest, @Body() data: ProcessPaymentDto) {
    return this.paymentService.processPayment(data.order_id, req.user.id, data.amount, data.method);
  }

  @Get(':id')
  @MessagePattern(PAYMENT_PATTERNS.GET_PAYMENT_DETAILS)
  @UseGuards(JwtAuthGuard)
  async getPaymentDetails(@Param('id') id: string) {
    return this.paymentService.getPaymentDetails(id);
  }

  @Post(':id/refund')
  @MessagePattern(PAYMENT_PATTERNS.PROCESS_REFUND)
  @UseGuards(JwtAuthGuard)
  async refundPayment(@Param('id') id: string, @Body() data: RefundPaymentDto) {
    return this.paymentService.refundPayment(id, data.refund_amount, data.refund_reason);
  }

  @Get('wallet/balance')
  @MessagePattern(PAYMENT_PATTERNS.GET_WALLET)
  @UseGuards(JwtAuthGuard)
  async getWallet(@Request() req: AuthenticatedRequest) {
    return this.paymentService.getWallet(req.user.id);
  }

  @Post('wallet/top-up')
  @MessagePattern(PAYMENT_PATTERNS.TOP_UP_WALLET)
  @UseGuards(JwtAuthGuard)
  async topUpWallet(@Request() req: AuthenticatedRequest, @Body() data: TopUpWalletDto) {
    return this.paymentService.topUpWallet(req.user.id, data.amount, data.payment_method);
  }

  @Get('wallet/transactions')
  @MessagePattern(PAYMENT_PATTERNS.GET_WALLET_TRANSACTIONS)
  @UseGuards(JwtAuthGuard)
  async getWalletTransactions(@Request() req: AuthenticatedRequest, @Query() query: WalletTransactionQueryDto) {
    return this.paymentService.getWalletTransactions(req.user.id, query.type, query.page, query.limit);
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
