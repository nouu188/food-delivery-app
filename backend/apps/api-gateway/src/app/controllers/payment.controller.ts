import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard, AuthenticatedRequest } from '@backend/common';
import { PAYMENT_PATTERNS } from '@backend/contracts';
import {
  ProcessPaymentDto,
  RefundPaymentDto,
  TopUpWalletDto,
  WalletTransactionQueryDto,
} from '@backend/shared';

@Controller('payments')
export class PaymentController {
  constructor(@Inject('PAYMENT_SERVICE') private readonly paymentService: ClientProxy) {}

  @Post('process')
  @UseGuards(JwtAuthGuard)
  async processPayment(@Request() req: AuthenticatedRequest, @Body() data: ProcessPaymentDto) {
    return firstValueFrom(
      this.paymentService.send(PAYMENT_PATTERNS.PROCESS_PAYMENT, {
        userId: req.user.id,
        ...data,
      })
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPaymentDetails(@Param('id') id: string) {
    return firstValueFrom(this.paymentService.send(PAYMENT_PATTERNS.GET_PAYMENT_DETAILS, { id }));
  }

  @Post(':id/refund')
  @UseGuards(JwtAuthGuard)
  async refundPayment(@Param('id') id: string, @Body() data: RefundPaymentDto) {
    return firstValueFrom(
      this.paymentService.send(PAYMENT_PATTERNS.PROCESS_REFUND, {
        id,
        ...data,
      })
    );
  }

  @Get('wallet/balance')
  @UseGuards(JwtAuthGuard)
  async getWallet(@Request() req: AuthenticatedRequest) {
    return firstValueFrom(
      this.paymentService.send(PAYMENT_PATTERNS.GET_WALLET, { userId: req.user.id })
    );
  }

  @Post('wallet/top-up')
  @UseGuards(JwtAuthGuard)
  async topUpWallet(@Request() req: AuthenticatedRequest, @Body() data: TopUpWalletDto) {
    return firstValueFrom(
      this.paymentService.send(PAYMENT_PATTERNS.TOP_UP_WALLET, {
        userId: req.user.id,
        ...data,
      })
    );
  }

  @Get('wallet/transactions')
  @UseGuards(JwtAuthGuard)
  async getWalletTransactions(
    @Request() req: AuthenticatedRequest,
    @Query() query: WalletTransactionQueryDto
  ) {
    return firstValueFrom(
      this.paymentService.send(PAYMENT_PATTERNS.GET_WALLET_TRANSACTIONS, {
        userId: req.user.id,
        ...query,
      })
    );
  }
}
