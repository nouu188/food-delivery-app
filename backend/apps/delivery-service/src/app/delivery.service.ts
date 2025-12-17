import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Driver, DriverLocation, Delivery } from '@backend/database';
import { DriverStatus, DeliveryStatus } from '@backend/shared';
import { DriverAssignedEvent, DeliveryStatusChangedEvent, DriverLocationUpdatedEvent, DELIVERY_EVENTS } from '@backend/contracts';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(DriverLocation)
    private readonly locationRepository: Repository<DriverLocation>,
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async registerDriver(userId: string, vehicleType: string, vehiclePlate: string, licenseNumber: string, licenseImageUrl: string) {
    const existingDriver = await this.driverRepository.findOne({
      where: { user_id: userId },
    });

    if (existingDriver) {
      throw new BadRequestException('Driver already registered');
    }

    const driver = this.driverRepository.create({
      user_id: userId,
      vehicle_type: vehicleType as any,
      vehicle_plate: vehiclePlate,
      license_number: licenseNumber,
      license_image_url: licenseImageUrl,
      status: DriverStatus.PENDING,
      is_online: false,
      is_verified: false,
      average_rating: 0,
      total_deliveries: 0,
    });

    return this.driverRepository.save(driver);
  }

  async getDriverProfile(userId: string) {
    const driver = await this.driverRepository.findOne({
      where: { user_id: userId },
      relations: ['user'],
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const latestLocation = await this.locationRepository.findOne({
      where: { driver_id: driver.id },
      order: { recorded_at: 'DESC' },
    });

    return {
      ...driver,
      current_location: latestLocation
        ? {
            latitude: latestLocation.latitude,
            longitude: latestLocation.longitude,
          }
        : null,
    };
  }

  async updateDriverProfile(userId: string, data: any) {
    const driver = await this.driverRepository.findOne({
      where: { user_id: userId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    Object.assign(driver, data);
    return this.driverRepository.save(driver);
  }

  async updateDriverStatus(userId: string, isOnline: boolean) {
    const driver = await this.driverRepository.findOne({
      where: { user_id: userId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    driver.is_online = isOnline;
    return this.driverRepository.save(driver);
  }

  async updateDriverLocation(userId: string, latitude: number, longitude: number, heading?: number, speed?: number) {
    const driver = await this.driverRepository.findOne({
      where: { user_id: userId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const location = this.locationRepository.create({
      driver_id: driver.id,
      latitude,
      longitude,
      heading: heading || 0,
      speed: speed || 0,
      recorded_at: new Date(),
    });

    await this.locationRepository.save(location);

    this.eventEmitter.emit(
      DELIVERY_EVENTS.DRIVER_LOCATION_UPDATED,
      new DriverLocationUpdatedEvent(driver.id, latitude, longitude)
    );

    return location;
  }

  async getAvailableDeliveries(userId: string) {
    const driver = await this.driverRepository.findOne({
      where: { user_id: userId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    if (!driver.is_online) {
      throw new BadRequestException('Driver must be online to view available deliveries');
    }

    return this.deliveryRepository.find({
      where: { status: DeliveryStatus.ASSIGNED, driver_id: driver.id },
      relations: ['order'],
      order: { assigned_at: 'DESC' },
      take: 20,
    });
  }

  async acceptDelivery(userId: string, deliveryId: string) {
    const driver = await this.driverRepository.findOne({
      where: { user_id: userId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
      relations: ['order', 'driver'],
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    if (delivery.status !== DeliveryStatus.ASSIGNED) {
      throw new BadRequestException('Delivery is not available for acceptance');
    }

    return delivery;
  }

  async updateDeliveryStatus(userId: string, deliveryId: string, status: DeliveryStatus, deliveryProofUrl?: string, failureReason?: string) {
    const driver = await this.driverRepository.findOne({
      where: { user_id: userId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId, driver_id: driver.id },
      relations: ['order'],
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    const previousStatus = delivery.status;
    delivery.status = status;

    if (status === DeliveryStatus.PICKED_UP) {
      delivery.picked_up_at = new Date();
    } else if (status === DeliveryStatus.DELIVERED) {
      delivery.delivered_at = new Date();
      delivery.delivery_proof_url = deliveryProofUrl;
    } else if (status === DeliveryStatus.FAILED) {
      delivery.failure_reason = failureReason;
    }

    await this.deliveryRepository.save(delivery);

    this.eventEmitter.emit(
      DELIVERY_EVENTS.STATUS_CHANGED,
      new DeliveryStatusChangedEvent(delivery.id, delivery.order_id,  driver.id, previousStatus, status)
    );

    return delivery;
  }

  async getDeliveryTracking(deliveryId: string) {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
      relations: ['driver', 'driver.user', 'order'],
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    const currentLocation = await this.locationRepository.findOne({
      where: { driver_id: delivery.driver_id },
      order: { recorded_at: 'DESC' },
    });

    return {
      ...delivery,
      current_location: currentLocation
        ? {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            heading: currentLocation.heading,
            speed: currentLocation.speed,
            updated_at: currentLocation.recorded_at,
          }
        : null,
    };
  }

  async getDeliveryByOrderId(orderId: string) {
    const delivery = await this.deliveryRepository.findOne({
      where: { order_id: orderId },
      relations: ['driver', 'order'],
    });

    return delivery;
  }

  async assignDriver(orderId: string, pickupLatitude: number, pickupLongitude: number, dropoffLatitude: number, dropoffLongitude: number) {
    const availableDrivers = await this.driverRepository.find({
      where: { is_online: true, is_verified: true, status: DriverStatus.APPROVED },
    });

    if (availableDrivers.length === 0) {
      throw new BadRequestException('No available drivers');
    }

    const selectedDriver = availableDrivers[0];

    const distanceKm = this.calculateDistance(pickupLatitude, pickupLongitude, dropoffLatitude, dropoffLongitude);
    const estimatedDuration = Math.ceil(distanceKm * 5);

    const delivery = this.deliveryRepository.create({
      order_id: orderId,
      driver_id: selectedDriver.id,
      status: DeliveryStatus.ASSIGNED,
      pickup_latitude: pickupLatitude,
      pickup_longitude: pickupLongitude,
      dropoff_latitude: dropoffLatitude,
      dropoff_longitude: dropoffLongitude,
      distance_km: distanceKm,
      estimated_duration: estimatedDuration,
      assigned_at: new Date(),
    });

    await this.deliveryRepository.save(delivery);

    this.eventEmitter.emit(
      DELIVERY_EVENTS.DRIVER_ASSIGNED,
      new DriverAssignedEvent(delivery.id, orderId, selectedDriver.id)
    );

    return delivery;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
