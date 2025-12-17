import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Voucher, VoucherUsage } from '@backend/database';
import { DiscountType } from '@backend/shared';
import { VoucherUsedEvent, VOUCHER_EVENTS } from '@backend/contracts';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
    @InjectRepository(VoucherUsage)
    private readonly usageRepository: Repository<VoucherUsage>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getAvailableVouchers(userId: string, restaurantId?: string) {
    const queryBuilder = this.voucherRepository
      .createQueryBuilder('voucher')
      .leftJoinAndSelect('voucher.restaurant', 'restaurant')
      .where('voucher.is_active = :isActive', { isActive: true })
      .andWhere('voucher.valid_from <= :now', { now: new Date() })
      .andWhere('voucher.valid_until >= :now', { now: new Date() })
      .andWhere('(voucher.usage_limit IS NULL OR voucher.usage_count < voucher.usage_limit)');

    if (restaurantId) {
      queryBuilder.andWhere('(voucher.restaurant_id = :restaurantId OR voucher.restaurant_id IS NULL)', { restaurantId });
    }

    return queryBuilder.orderBy('voucher.created_at', 'DESC').getMany();
  }

  async getVoucherByCode(code: string) {
    const voucher = await this.voucherRepository.findOne({
      where: { code },
      relations: ['restaurant'],
    });

    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    return voucher;
  }

  async validateVoucher(code: string, userId: string, restaurantId: string, orderAmount: number) {
    const voucher = await this.voucherRepository.findOne({
      where: { code, is_active: true },
      relations: ['restaurant'],
    });

    if (!voucher) {
      return {
        is_valid: false,
        message: 'Voucher not found or inactive',
      };
    }

    const now = new Date();
    if (voucher.valid_from > now || voucher.valid_until < now) {
      return {
        is_valid: false,
        message: 'Voucher is expired or not yet valid',
      };
    }

    if (voucher.restaurant_id && voucher.restaurant_id !== restaurantId) {
      return {
        is_valid: false,
        message: 'Voucher is not valid for this restaurant',
      };
    }

    if (voucher.min_order_amount > orderAmount) {
      return {
        is_valid: false,
        message: `Minimum order amount is ${voucher.min_order_amount}`,
      };
    }

    if (voucher.usage_limit && voucher.usage_count >= voucher.usage_limit) {
      return {
        is_valid: false,
        message: 'Voucher usage limit reached',
      };
    }

    const userUsageCount = await this.usageRepository.count({
      where: { voucher_id: voucher.id, user_id: userId },
    });

    if (userUsageCount >= voucher.per_user_limit) {
      return {
        is_valid: false,
        message: 'You have reached the usage limit for this voucher',
      };
    }

    let discountAmount = 0;

    if (voucher.discount_type === DiscountType.PERCENTAGE) {
      discountAmount = (orderAmount * voucher.discount_value) / 100;
      if (voucher.max_discount) {
        discountAmount = Math.min(discountAmount, voucher.max_discount);
      }
    } else if (voucher.discount_type === DiscountType.FIXED_AMOUNT) {
      discountAmount = voucher.discount_value;
    } else if (voucher.discount_type === DiscountType.FREE_DELIVERY) {
      discountAmount = 0;
    }

    return {
      is_valid: true,
      voucher,
      discount_amount: discountAmount,
      final_amount: orderAmount - discountAmount,
    };
  }

  async createVoucher(data: any) {
    const existingVoucher = await this.voucherRepository.findOne({
      where: { code: data.code },
    });

    if (existingVoucher) {
      throw new BadRequestException('Voucher code already exists');
    }

    const voucher = this.voucherRepository.create(data);
    return this.voucherRepository.save(voucher);
  }

  async updateVoucher(id: string, data: any) {
    const voucher = await this.voucherRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });

    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    Object.assign(voucher, data);
    return this.voucherRepository.save(voucher);
  }

  async deactivateVoucher(id: string) {
    const voucher = await this.voucherRepository.findOne({
      where: { id },
    });

    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    voucher.is_active = false;
    await this.voucherRepository.save(voucher);

    return { message: 'Voucher deactivated successfully' };
  }

  async applyVoucher(voucherId: string, userId: string, orderId: string, discountApplied: number) {
    const voucher = await this.voucherRepository.findOne({
      where: { id: voucherId },
      relations: ['restaurant'],
    });

    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }

    voucher.usage_count += 1;
    await this.voucherRepository.save(voucher);

    const usage = this.usageRepository.create({
      voucher_id: voucherId,
      user_id: userId,
      order_id: orderId,
      discount_applied: discountApplied,
    });

    await this.usageRepository.save(usage);

    this.eventEmitter.emit(
      VOUCHER_EVENTS.USED,
      new VoucherUsedEvent(voucherId, userId, orderId, discountApplied)
    );

    const savedUsage = await this.usageRepository.findOne({
      where: { id: usage.id },
      relations: ['user', 'order', 'voucher'],
    });

    return savedUsage;
  }
}
