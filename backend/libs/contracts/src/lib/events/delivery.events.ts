import { DeliveryStatus } from "@backend/shared";

export class DriverAssignedEvent {
  constructor(
    public readonly deliveryId: string,
    public readonly orderId: string,
    public readonly driverId: string,
  ) {}
}

export class DeliveryStatusChangedEvent {
  constructor(
    public readonly deliveryId: string,
    public readonly orderId: string,
    public readonly driverId: string,
    public readonly previousStatus: DeliveryStatus,
    public readonly status: DeliveryStatus,
  ) {}
}

export class DriverLocationUpdatedEvent {
  constructor(
    public readonly driverId: string,
    public readonly latitude: number,
    public readonly longitude: number,
  ) {}
}
