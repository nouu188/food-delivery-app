import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Payment, Wallet, WalletTransaction } from '@backend/database';
import { PaymentStatus, PaymentMethod, WalletTransactionType } from '@backend/shared';
import { PaymentCompletedEvent, PaymentFailedEvent, RefundProcessedEvent, PAYMENT_EVENTS } from '@backend/contracts';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(WalletTransaction)
    private readonly transactionRepository: Repository<WalletTransaction>,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async processPayment(orderId: string, userId: string, amount: number, method: PaymentMethod) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const payment = this.paymentRepository.create({
        order_id: orderId,
        user_id: userId,
        amount,
        method,
        status: PaymentStatus.PENDING,
      });

      await queryRunner.manager.save(payment);

      if (method === PaymentMethod.WALLET) {
        const wallet = await queryRunner.manager.findOne(Wallet, {
          where: { user_id: userId },
        });

        if (!wallet || wallet.balance < amount) {
          throw new BadRequestException('Insufficient wallet balance');
        }

        const balanceBefore = wallet.balance;
        wallet.balance -= amount;
        await queryRunner.manager.save(wallet);

        const transaction = this.transactionRepository.create({
          wallet_id: wallet.id,
          type: WalletTransactionType.PAYMENT,
          amount: -amount,
          balance_before: balanceBefore,
          balance_after: wallet.balance,
          reference_type: 'order',
          reference_id: orderId,
          description: `Payment for order ${orderId}`,
        });

        await queryRunner.manager.save(transaction);
      }

      payment.status = PaymentStatus.COMPLETED;
      payment.paid_at = new Date();
      payment.transaction_id = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await queryRunner.manager.save(payment);
      await queryRunner.commitTransaction();

      this.eventEmitter.emit(
        PAYMENT_EVENTS.COMPLETED,
        new PaymentCompletedEvent(payment.id, orderId, userId, amount, payment.method)
      );

      return payment;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      const failedPayment = await this.paymentRepository.findOne({
        where: { order_id: orderId },
      });

      if (failedPayment) {
        failedPayment.status = PaymentStatus.FAILED;
        await this.paymentRepository.save(failedPayment);

        this.eventEmitter.emit(
          PAYMENT_EVENTS.FAILED,
          new PaymentFailedEvent(failedPayment.id, orderId, error.message)
        );
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getPaymentDetails(paymentId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['order', 'user'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async getPaymentByOrderId(orderId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { order_id: orderId },
    });

    return payment;
  }

  async refundPayment(paymentId: string, refundAmount: number, refundReason: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    if (refundAmount > payment.amount) {
      throw new BadRequestException('Refund amount cannot exceed payment amount');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      payment.status = PaymentStatus.REFUNDED;
      payment.refund_amount = refundAmount;
      payment.refunded_at = new Date();
      payment.refund_reason = refundReason;

      await queryRunner.manager.save(payment);

      if (payment.method === PaymentMethod.WALLET) {
        const wallet = await queryRunner.manager.findOne(Wallet, {
          where: { user_id: payment.user_id },
        });

        if (wallet) {
          const balanceBefore = wallet.balance;
          wallet.balance += refundAmount;
          await queryRunner.manager.save(wallet);

          const transaction = this.transactionRepository.create({
            wallet_id: wallet.id,
            type: WalletTransactionType.REFUND,
            amount: refundAmount,
            balance_before: balanceBefore,
            balance_after: wallet.balance,
            reference_type: 'payment',
            reference_id: payment.id,
            description: `Refund for order ${payment.order_id}`,
          });

          await queryRunner.manager.save(transaction);
        }
      }

      await queryRunner.commitTransaction();

      this.eventEmitter.emit(
        PAYMENT_EVENTS.REFUNDED,
        new RefundProcessedEvent(payment.id, payment.order_id, refundAmount, payment.refund_reason)
      );

      return payment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getWallet(userId: string) {
    let wallet = await this.walletRepository.findOne({
      where: { user_id: userId },
    });

    if (!wallet) {
      wallet = this.walletRepository.create({
        user_id: userId,
        balance: 0,
        currency: 'VND',
        is_active: true,
      });
      await this.walletRepository.save(wallet);
    }

    return wallet;
  }

  async topUpWallet(userId: string, amount: number, method: PaymentMethod) {
    const wallet = await this.getWallet(userId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const balanceBefore = wallet.balance;
      wallet.balance += amount;
      await queryRunner.manager.save(wallet);

      const transaction = this.transactionRepository.create({
        wallet_id: wallet.id,
        type: WalletTransactionType.TOP_UP,
        amount,
        balance_before: balanceBefore,
        balance_after: wallet.balance,
        reference_type: 'top_up',
        reference_id: `TOP_UP-${Date.now()}`,
        description: `Wallet top-up via ${method}`,
      });

      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();

      return wallet;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getWalletTransactions(userId: string, type?: WalletTransactionType, page = 1, limit = 20) {
    const wallet = await this.getWallet(userId);

    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.wallet_id = :walletId', { walletId: wallet.id });

    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }

    const total = await queryBuilder.getCount();

    const data = await queryBuilder
      .orderBy('transaction.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }
}
