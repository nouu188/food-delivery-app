import { Controller, Get } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { DeliveryService } from './delivery.service';
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

  @MessagePattern(DELIVERY_PATTERNS.REGISTER_DRIVER)
  async registerDriver(data: any) {
    return this.deliveryService.registerDriver(
      data.userId,
      data.vehicle_type,
      data.vehicle_plate,
      data.license_number,
      data.license_image_url
    );
  }

  @MessagePattern(DELIVERY_PATTERNS.GET_DRIVER_PROFILE)
  async getDriverProfile(data: { userId: string }) {
    return this.deliveryService.getDriverProfile(data.userId);
  }

  @MessagePattern(DELIVERY_PATTERNS.UPDATE_DRIVER_PROFILE)
  async updateDriverProfile(data: any) {
    return this.deliveryService.updateDriverProfile(data.userId, data);
  }

  @MessagePattern(DELIVERY_PATTERNS.UPDATE_DRIVER_STATUS)
  async updateDriverStatus(data: any) {
    return this.deliveryService.updateDriverStatus(data.userId, data.is_online);
  }

  @MessagePattern(DELIVERY_PATTERNS.UPDATE_DRIVER_LOCATION)
  async updateDriverLocation(data: any) {
    return this.deliveryService.updateDriverLocation(data.userId, data.latitude, data.longitude, data.heading, data.speed);
  }

  @MessagePattern(DELIVERY_PATTERNS.GET_AVAILABLE_DELIVERIES)
  async getAvailableDeliveries(data: { userId: string }) {
    return this.deliveryService.getAvailableDeliveries(data.userId);
  }

  @MessagePattern(DELIVERY_PATTERNS.ACCEPT_DELIVERY)
  async acceptDelivery(data: { userId: string; id: string }) {
    return this.deliveryService.acceptDelivery(data.userId, data.id);
  }

  @MessagePattern(DELIVERY_PATTERNS.UPDATE_DELIVERY_STATUS)
  async updateDeliveryStatus(data: any) {
    return this.deliveryService.updateDeliveryStatus(data.userId, data.id, data.status, data.delivery_proof_url, data.failure_reason);
  }

  @MessagePattern(DELIVERY_PATTERNS.GET_DELIVERY_TRACKING)
  async getDeliveryTracking(data: { id: string }) {
    return this.deliveryService.getDeliveryTracking(data.id);
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
