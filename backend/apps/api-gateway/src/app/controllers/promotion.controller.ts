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
  HttpException,
  HttpStatus,
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
    try {
      return await firstValueFrom(
        this.promotionService.send(PROMOTION_PATTERNS.GET_AVAILABLE_VOUCHERS, {
          userId: req.user.id,
          restaurantId,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get available vouchers',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal promotion error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':code')
  async getVoucherByCode(@Param('code') code: string) {
    try {
      return await firstValueFrom(
        this.promotionService.send(PROMOTION_PATTERNS.GET_VOUCHER_BY_CODE, { code })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Voucher not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get voucher',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal promotion error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  async validateVoucher(@Request() req: AuthenticatedRequest, @Body() data: ValidateVoucherDto) {
    try {
      return await firstValueFrom(
        this.promotionService.send(PROMOTION_PATTERNS.VALIDATE_VOUCHER, {
          userId: req.user.id,
          ...data,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Voucher not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Voucher is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to validate voucher',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal promotion error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  async createVoucher(@Body() data: CreateVoucherDto) {
    try {
      return await firstValueFrom(this.promotionService.send(PROMOTION_PATTERNS.CREATE_VOUCHER, data));
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 409) {
        throw new HttpException(
          errorData.message || 'Voucher code already exists',
          HttpStatus.CONFLICT,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid voucher data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to create voucher',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal promotion error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  async updateVoucher(@Param('id') id: string, @Body() data: UpdateVoucherDto) {
    try {
      return await firstValueFrom(
        this.promotionService.send(PROMOTION_PATTERNS.UPDATE_VOUCHER, { id, ...data })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Voucher not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid voucher data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to update this voucher',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to update voucher',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal promotion error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RESTAURANT_OWNER)
  async deactivateVoucher(@Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.promotionService.send(PROMOTION_PATTERNS.DEACTIVATE_VOUCHER, { id })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Voucher not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to deactivate this voucher',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to deactivate voucher',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal promotion error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
