export class RestaurantCreatedEvent {
  constructor(
    public readonly restaurantId: string,
    public readonly ownerId: string,
    public readonly name: string,
  ) {}
}

export class RestaurantStatusChangedEvent {
  constructor(
    public readonly restaurantId: string,
    public readonly isOpen: boolean,
  ) {}
}

export class MenuItemUpdatedEvent {
  constructor(
    public readonly menuItemId: string,
    public readonly restaurantId: string,
    public readonly isAvailable: boolean,
  ) {}
}
