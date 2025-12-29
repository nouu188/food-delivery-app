import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
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
  RegisterDriverDto,
  UpdateDriverDto,
  UpdateDriverStatusDto,
  UpdateDriverLocationDto,
  UpdateDeliveryStatusDto,
} from '@backend/shared';
import { DELIVERY_PATTERNS } from '@backend/contracts';

@Controller('deliveries')
export class DeliveryController {
  constructor(@Inject('DELIVERY_SERVICE') private readonly deliveryService: ClientProxy) {}

  @Post('drivers/register')
  @UseGuards(JwtAuthGuard)
  async registerDriver(@Request() req: AuthenticatedRequest, @Body() data: RegisterDriverDto) {
    try {
      return await firstValueFrom(
        this.deliveryService.send(DELIVERY_PATTERNS.REGISTER_DRIVER, {
          userId: req.user.id,
          ...data,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 409) {
        throw new HttpException(
          errorData.message || 'Driver already registered',
          HttpStatus.CONFLICT,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid driver registration data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Driver registration failed',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal delivery error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('drivers/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async getDriverProfile(@Request() req: AuthenticatedRequest) {
    try {
      return await firstValueFrom(
        this.deliveryService.send(DELIVERY_PATTERNS.GET_DRIVER_PROFILE, { userId: req.user.id })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Driver profile not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get driver profile',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal delivery error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('drivers/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async updateDriverProfile(@Request() req: AuthenticatedRequest, @Body() data: UpdateDriverDto) {
    try {
      return await firstValueFrom(
        this.deliveryService.send(DELIVERY_PATTERNS.UPDATE_DRIVER_PROFILE, {
          userId: req.user.id,
          ...data,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Driver profile not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid driver profile data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to update driver profile',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal delivery error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('drivers/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async updateDriverStatus(@Request() req: AuthenticatedRequest, @Body() data: UpdateDriverStatusDto) {
    try {
      return await firstValueFrom(
        this.deliveryService.send(DELIVERY_PATTERNS.UPDATE_DRIVER_STATUS, {
          userId: req.user.id,
          ...data,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Driver not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid status data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to update driver status',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal delivery error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('drivers/location')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async updateDriverLocation(
    @Request() req: AuthenticatedRequest,
    @Body() data: UpdateDriverLocationDto
  ) {
    try {
      return await firstValueFrom(
        this.deliveryService.send(DELIVERY_PATTERNS.UPDATE_DRIVER_LOCATION, {
          userId: req.user.id,
          ...data,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Driver not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid location data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to update driver location',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal delivery error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('available')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async getAvailableDeliveries(@Request() req: AuthenticatedRequest) {
    try {
      return await firstValueFrom(
        this.deliveryService.send(DELIVERY_PATTERNS.GET_AVAILABLE_DELIVERIES, {
          userId: req.user.id,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get available deliveries',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal delivery error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id/accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async acceptDelivery(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.deliveryService.send(DELIVERY_PATTERNS.ACCEPT_DELIVERY, {
          userId: req.user.id,
          deliveryId: id,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Delivery not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 409) {
        throw new HttpException(
          errorData.message || 'Delivery already accepted',
          HttpStatus.CONFLICT,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to accept delivery',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal delivery error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async updateDeliveryStatus(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: UpdateDeliveryStatusDto
  ) {
    try {
      return await firstValueFrom(
        this.deliveryService.send(DELIVERY_PATTERNS.UPDATE_DELIVERY_STATUS, {
          userId: req.user.id,
          deliveryId: id,
          ...data,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Delivery not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid status data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to update this delivery',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to update delivery status',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal delivery error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/track')
  async getDeliveryTracking(@Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.deliveryService.send(DELIVERY_PATTERNS.GET_DELIVERY_TRACKING, { id })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Delivery not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get delivery tracking',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal delivery error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
