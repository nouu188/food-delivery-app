import { Controller, Get } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { PromotionService } from './promotion.service';
import { PROMOTION_PATTERNS, ORDER_EVENTS } from '@backend/contracts';

@Controller('vouchers')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'promotion-service',
      timestamp: new Date().toISOString(),
    };
  }

  @MessagePattern(PROMOTION_PATTERNS.GET_AVAILABLE_VOUCHERS)
  async getAvailableVouchers(data: { userId: string; restaurant_id?: string }) {
    return this.promotionService.getAvailableVouchers(data.userId, data.restaurant_id);
  }

  @MessagePattern(PROMOTION_PATTERNS.GET_VOUCHER_BY_CODE)
  async getVoucherByCode(data: { code: string }) {
    return this.promotionService.getVoucherByCode(data.code);
  }

  @MessagePattern(PROMOTION_PATTERNS.VALIDATE_VOUCHER)
  async validateVoucher(data: any) {
    return this.promotionService.validateVoucher(data.code, data.userId, data.restaurant_id, data.order_amount);
  }

  @MessagePattern(PROMOTION_PATTERNS.CREATE_VOUCHER)
  async createVoucher(data: any) {
    return this.promotionService.createVoucher(data);
  }

  @MessagePattern(PROMOTION_PATTERNS.UPDATE_VOUCHER)
  async updateVoucher(data: any) {
    return this.promotionService.updateVoucher(data.id, data);
  }

  @MessagePattern(PROMOTION_PATTERNS.DEACTIVATE_VOUCHER)
  async deactivateVoucher(data: { id: string }) {
    return this.promotionService.deactivateVoucher(data.id);
  }

  @EventPattern(ORDER_EVENTS.CREATED)
  async handleOrderCreated(data: any) {
    if (data.voucherId) {
      await this.promotionService.applyVoucher(data.voucherId, data.userId, data.orderId, data.discountAmount);
    }
  }
}
