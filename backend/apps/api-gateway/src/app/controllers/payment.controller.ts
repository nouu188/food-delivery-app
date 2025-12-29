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
  HttpException,
  HttpStatus,
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
    try {
      return await firstValueFrom(
        this.paymentService.send(PAYMENT_PATTERNS.PROCESS_PAYMENT, {
          userId: req.user.id,
          ...data,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid payment data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode === 402) {
        throw new HttpException(
          errorData.message || 'Insufficient funds',
          HttpStatus.PAYMENT_REQUIRED,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Payment processing failed',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal payment error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPaymentDetails(@Param('id') id: string) {
    try {
      return await firstValueFrom(this.paymentService.send(PAYMENT_PATTERNS.GET_PAYMENT_DETAILS, { id }));
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Payment not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get payment details',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal payment error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/refund')
  @UseGuards(JwtAuthGuard)
  async refundPayment(@Param('id') id: string, @Body() data: RefundPaymentDto) {
    try {
      return await firstValueFrom(
        this.paymentService.send(PAYMENT_PATTERNS.PROCESS_REFUND, {
          id,
          ...data,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Payment not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid refund data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Refund processing failed',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal payment error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('wallet/balance')
  @UseGuards(JwtAuthGuard)
  async getWallet(@Request() req: AuthenticatedRequest) {
    try {
      return await firstValueFrom(
        this.paymentService.send(PAYMENT_PATTERNS.GET_WALLET, { userId: req.user.id })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Wallet not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get wallet',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal payment error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('wallet/top-up')
  @UseGuards(JwtAuthGuard)
  async topUpWallet(@Request() req: AuthenticatedRequest, @Body() data: TopUpWalletDto) {
    try {
      return await firstValueFrom(
        this.paymentService.send(PAYMENT_PATTERNS.TOP_UP_WALLET, {
          userId: req.user.id,
          ...data,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid top-up data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Top-up failed',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal payment error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('wallet/transactions')
  @UseGuards(JwtAuthGuard)
  async getWalletTransactions(
    @Request() req: AuthenticatedRequest,
    @Query() query: WalletTransactionQueryDto
  ) {
    try {
      return await firstValueFrom(
        this.paymentService.send(PAYMENT_PATTERNS.GET_WALLET_TRANSACTIONS, {
          userId: req.user.id,
          ...query,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Wallet not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get wallet transactions',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal payment error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
