export class ReviewCreatedEvent {
  constructor(
    public readonly reviewId: string,
    public readonly restaurantId: string,
    public readonly foodRating: number,
    public readonly deliveryRating: number,
    public readonly driverId?: string,
  ) {}
}
