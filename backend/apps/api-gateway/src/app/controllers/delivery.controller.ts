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
    return firstValueFrom(
      this.deliveryService.send(DELIVERY_PATTERNS.REGISTER_DRIVER, {
        userId: req.user.id,
        ...data,
      })
    );
  }

  @Get('drivers/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async getDriverProfile(@Request() req: AuthenticatedRequest) {
    return firstValueFrom(
      this.deliveryService.send(DELIVERY_PATTERNS.GET_DRIVER_PROFILE, { userId: req.user.id })
    );
  }

  @Put('drivers/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async updateDriverProfile(@Request() req: AuthenticatedRequest, @Body() data: UpdateDriverDto) {
    return firstValueFrom(
      this.deliveryService.send(DELIVERY_PATTERNS.UPDATE_DRIVER_PROFILE, {
        userId: req.user.id,
        ...data,
      })
    );
  }

  @Put('drivers/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async updateDriverStatus(@Request() req: AuthenticatedRequest, @Body() data: UpdateDriverStatusDto) {
    return firstValueFrom(
      this.deliveryService.send(DELIVERY_PATTERNS.UPDATE_DRIVER_STATUS, {
        userId: req.user.id,
        ...data,
      })
    );
  }

  @Put('drivers/location')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async updateDriverLocation(
    @Request() req: AuthenticatedRequest,
    @Body() data: UpdateDriverLocationDto
  ) {
    return firstValueFrom(
      this.deliveryService.send(DELIVERY_PATTERNS.UPDATE_DRIVER_LOCATION, {
        userId: req.user.id,
        ...data,
      })
    );
  }

  @Get('available')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async getAvailableDeliveries(@Request() req: AuthenticatedRequest) {
    return firstValueFrom(
      this.deliveryService.send(DELIVERY_PATTERNS.GET_AVAILABLE_DELIVERIES, {
        userId: req.user.id,
      })
    );
  }

  @Put(':id/accept')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async acceptDelivery(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return firstValueFrom(
      this.deliveryService.send(DELIVERY_PATTERNS.ACCEPT_DELIVERY, {
        userId: req.user.id,
        deliveryId: id,
      })
    );
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async updateDeliveryStatus(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: UpdateDeliveryStatusDto
  ) {
    return firstValueFrom(
      this.deliveryService.send(DELIVERY_PATTERNS.UPDATE_DELIVERY_STATUS, {
        userId: req.user.id,
        deliveryId: id,
        ...data,
      })
    );
  }

  @Get(':id/track')
  async getDeliveryTracking(@Param('id') id: string) {
    return firstValueFrom(
      this.deliveryService.send(DELIVERY_PATTERNS.GET_DELIVERY_TRACKING, { id })
    );
  }
}
