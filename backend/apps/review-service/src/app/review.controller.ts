import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { ReviewService } from './review.service';
import { REVIEW_PATTERNS, ORDER_EVENTS, OrderDeliveredPayload } from '@backend/contracts';

@Controller('reviews')
export class ReviewController {
  private readonly logger = new Logger(ReviewController.name);

  constructor(private readonly reviewService: ReviewService) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'review-service',
      timestamp: new Date().toISOString(),
    };
  }

  @MessagePattern(REVIEW_PATTERNS.CREATE_REVIEW)
  async createReview(data: any) {
    return this.reviewService.createReview(
      data.userId,
      data.order_id,
      data.food_rating,
      data.delivery_rating,
      data.comment,
      data.is_anonymous,
      data.image_urls
    );
  }

  @MessagePattern(REVIEW_PATTERNS.GET_RESTAURANT_REVIEWS)
  async getRestaurantReviews(data: any) {
    return this.reviewService.getRestaurantReviews(data.id, data.min_rating, data.has_images, data.page, data.limit);
  }

  @MessagePattern(REVIEW_PATTERNS.GET_REVIEW_BY_ID)
  async getReviewById(data: { id: string }) {
    return this.reviewService.getReviewById(data.id);
  }

  @MessagePattern(REVIEW_PATTERNS.REPLY_TO_REVIEW)
  async replyToReview(data: any) {
    return this.reviewService.replyToReview(data.restaurant_id, data.id, data.restaurant_reply);
  }

  @EventPattern(ORDER_EVENTS.DELIVERED)
  async handleOrderDelivered(data: OrderDeliveredPayload) {
    this.logger.log(`Order ${data.orderId} delivered to user ${data.userId} at ${data.deliveredAt}`);

    // Order is now eligible for review
    // The actual review creation will be handled by the createReview endpoint
    // when the user decides to submit a review
  }
}
