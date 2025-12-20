import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard, Roles, RolesGuard } from '@backend/common';
import { UserRole, RegisterDriverDto, UpdateDriverDto, UpdateDriverStatusDto, UpdateDriverLocationDto, UpdateDeliveryStatusDto } from '@backend/shared';
import { DELIVERY_PATTERNS, ORDER_EVENTS } from '@backend/contracts';

@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'delivery-service',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('drivers/register')
  @MessagePattern(DELIVERY_PATTERNS.REGISTER_DRIVER)
  @UseGuards(JwtAuthGuard)
  async registerDriver(@Request() req: any, @Body() data: RegisterDriverDto) {
    return this.deliveryService.registerDriver(
      req.user.id,
      data.vehicle_type,
      data.vehicle_plate,
      data.license_number,
      data.license_image_url
    );
  }

  @Get('drivers/me')
  @MessagePattern(DELIVERY_PATTERNS.GET_DRIVER_PROFILE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async getDriverProfile(@Request() req: any) {
    return this.deliveryService.getDriverProfile(req.user.id);
  }

  @Put('drivers/me')
  @MessagePattern(DELIVERY_PATTERNS.UPDATE_DRIVER_PROFILE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async updateDriverProfile(@Request() req: any, @Body() data: UpdateDriverDto) {
    return this.deliveryService.updateDriverProfile(req.user.id, data);
  }

  @Put('drivers/status')
  @MessagePattern(DELIVERY_PATTERNS.UPDATE_DRIVER_STATUS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async updateDriverStatus(@Request() req: any, @Body() data: UpdateDriverStatusDto) {
    return this.deliveryService.updateDriverStatus(req.user.id, data.is_online);
  }

  @Put('drivers/location')
  @MessagePattern(DELIVERY_PATTERNS.UPDATE_DRIVER_LOCATION)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async updateDriverLocation(@Request() req: any, @Body() data: UpdateDriverLocationDto) {
    return this.deliveryService.updateDriverLocation(req.user.id, data.latitude, data.longitude, data.heading, data.speed);
  }

  @Get('available')
  @MessagePattern(DELIVERY_PATTERNS.GET_AVAILABLE_DELIVERIES)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async getAvailableDeliveries(@Request() req: any) {
    return this.deliveryService.getAvailableDeliveries(req.user.id);
  }

  @Put(':id/accept')
  @MessagePattern(DELIVERY_PATTERNS.ACCEPT_DELIVERY)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async acceptDelivery(@Request() req: any, @Param('id') id: string) {
    return this.deliveryService.acceptDelivery(req.user.id, id);
  }

  @Put(':id/status')
  @MessagePattern(DELIVERY_PATTERNS.UPDATE_DELIVERY_STATUS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DRIVER)
  async updateDeliveryStatus(@Request() req: any, @Param('id') id: string, @Body() data: UpdateDeliveryStatusDto) {
    return this.deliveryService.updateDeliveryStatus(req.user.id, id, data.status, data.delivery_proof_url, data.failure_reason);
  }

  @Get(':id/track')
  @MessagePattern(DELIVERY_PATTERNS.GET_DELIVERY_TRACKING)
  async getDeliveryTracking(@Param('id') id: string) {
    return this.deliveryService.getDeliveryTracking(id);
  }

  @EventPattern(ORDER_EVENTS.CREATED)
  async handleOrderCreated(data: any) {
    if (data.status === 'READY_FOR_PICKUP') {
      await this.deliveryService.assignDriver(data.orderId, data.pickupLatitude, data.pickupLongitude, data.dropoffLatitude, data.dropoffLongitude);
    }
  }

  @EventPattern(ORDER_EVENTS.CANCELLED)
  async handleOrderCancelled(data: any) {
    const delivery = await this.deliveryService.getDeliveryByOrderId(data.orderId);
    if (delivery) {
      await this.deliveryService.updateDeliveryStatus(data.userId, delivery.id, 'FAILED' as any, undefined, 'Order cancelled');
    }
  }
}
