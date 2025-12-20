import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { PromotionService } from './promotion.service';
import { JwtAuthGuard, Roles, RolesGuard } from '@backend/common';
import { UserRole, CreateVoucherDto, UpdateVoucherDto, ValidateVoucherDto } from '@backend/shared';
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

  @Get()
  @MessagePattern(PROMOTION_PATTERNS.GET_AVAILABLE_VOUCHERS)
  @UseGuards(JwtAuthGuard)
  async getAvailableVouchers(@Request() req: any, @Query('restaurant_id') restaurantId?: string) {
    return this.promotionService.getAvailableVouchers(req.user.id, restaurantId);
  }

  @Get(':code')
  @MessagePattern(PROMOTION_PATTERNS.GET_VOUCHER_BY_CODE)
  async getVoucherByCode(@Param('code') code: string) {
    return this.promotionService.getVoucherByCode(code);
  }

  @Post('validate')
  @MessagePattern(PROMOTION_PATTERNS.VALIDATE_VOUCHER)
  @UseGuards(JwtAuthGuard)
  async validateVoucher(@Request() req: any, @Body() data: ValidateVoucherDto) {
    return this.promotionService.validateVoucher(data.code, req.user.id, data.restaurant_id, data.order_amount);
  }

  @Post()
  @MessagePattern(PROMOTION_PATTERNS.CREATE_VOUCHER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  async createVoucher(@Body() data: CreateVoucherDto) {
    return this.promotionService.createVoucher(data);
  }

  @Put(':id')
  @MessagePattern(PROMOTION_PATTERNS.UPDATE_VOUCHER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  async updateVoucher(@Param('id') id: string, @Body() data: UpdateVoucherDto) {
    return this.promotionService.updateVoucher(id, data);
  }

  @Delete(':id')
  @MessagePattern(PROMOTION_PATTERNS.DEACTIVATE_VOUCHER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  async deactivateVoucher(@Param('id') id: string) {
    return this.promotionService.deactivateVoucher(id);
  }

  @EventPattern(ORDER_EVENTS.CREATED)
  async handleOrderCreated(data: any) {
    if (data.voucherId) {
      await this.promotionService.applyVoucher(data.voucherId, data.userId, data.orderId, data.discountAmount);
    }
  }
}
