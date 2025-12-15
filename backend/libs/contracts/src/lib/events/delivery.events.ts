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
    public readonly status: string,
  ) {}
}

export class DriverLocationUpdatedEvent {
  constructor(
    public readonly driverId: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly timestamp: Date,
  ) {}
}
