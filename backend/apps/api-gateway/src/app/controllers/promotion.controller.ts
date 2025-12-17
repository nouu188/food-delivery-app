import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard, Roles, RolesGuard, AuthenticatedRequest } from '@backend/common';
import {
  UserRole,
  CreateVoucherDto,
  UpdateVoucherDto,
  ValidateVoucherDto,
} from '@backend/shared';
import { PROMOTION_PATTERNS } from '@backend/contracts';

@Controller('vouchers')
export class PromotionController {
  constructor(@Inject('PROMOTION_SERVICE') private readonly promotionService: ClientProxy) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAvailableVouchers(
    @Request() req: AuthenticatedRequest,
    @Query('restaurant_id') restaurantId?: string
  ) {
    return firstValueFrom(
      this.promotionService.send(PROMOTION_PATTERNS.GET_AVAILABLE_VOUCHERS, {
        userId: req.user.id,
        restaurantId,
      })
    );
  }

  @Get(':code')
  async getVoucherByCode(@Param('code') code: string) {
    return firstValueFrom(
      this.promotionService.send(PROMOTION_PATTERNS.GET_VOUCHER_BY_CODE, { code })
    );
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  async validateVoucher(@Request() req: AuthenticatedRequest, @Body() data: ValidateVoucherDto) {
    return firstValueFrom(
      this.promotionService.send(PROMOTION_PATTERNS.VALIDATE_VOUCHER, {
        userId: req.user.id,
        ...data,
      })
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  async createVoucher(@Body() data: CreateVoucherDto) {
    return firstValueFrom(this.promotionService.send(PROMOTION_PATTERNS.CREATE_VOUCHER, data));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  async updateVoucher(@Param('id') id: string, @Body() data: UpdateVoucherDto) {
    return firstValueFrom(
      this.promotionService.send(PROMOTION_PATTERNS.UPDATE_VOUCHER, { id, ...data })
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  async deactivateVoucher(@Param('id') id: string) {
    return firstValueFrom(
      this.promotionService.send(PROMOTION_PATTERNS.DEACTIVATE_VOUCHER, { id })
    );
  }
}
