import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request, Logger } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { ReviewService } from './review.service';
import { AuthenticatedRequest, JwtAuthGuard, Roles, RolesGuard } from '@backend/common';
import { UserRole, CreateReviewDto, ReplyToReviewDto, ReviewQueryDto } from '@backend/shared';
import { REVIEW_PATTERNS, ORDER_EVENTS, OrderDeliveredPayload } from '@backend/contracts';

@Controller('reviews')
export class ReviewController {
  private readonly logger = new Logger(ReviewController.name);

  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @MessagePattern(REVIEW_PATTERNS.CREATE_REVIEW)
  @UseGuards(JwtAuthGuard)
  async createReview(@Request() req: AuthenticatedRequest, @Body() data: CreateReviewDto) {
    return this.reviewService.createReview(
      req.user.id,
      data.order_id,
      data.food_rating,
      data.delivery_rating,
      data.comment,
      data.is_anonymous,
      data.image_urls
    );
  }

  @Get('restaurants/:id')
  @MessagePattern(REVIEW_PATTERNS.GET_RESTAURANT_REVIEWS)
  async getRestaurantReviews(@Param('id') id: string, @Query() query: ReviewQueryDto) {
    return this.reviewService.getRestaurantReviews(id, query.min_rating, query.has_images, query.page, query.limit);
  }

  @Get(':id')
  @MessagePattern(REVIEW_PATTERNS.GET_REVIEW_BY_ID)
  async getReviewById(@Param('id') id: string) {
    return this.reviewService.getReviewById(id);
  }

  @Put(':id/reply')
  @MessagePattern(REVIEW_PATTERNS.REPLY_TO_REVIEW)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async replyToReview(@Request() req: AuthenticatedRequest, @Param('id') id: string, @Body() data: ReplyToReviewDto) {
    return this.reviewService.replyToReview(req.user.restaurant_id, id, data.restaurant_reply);
  }

  @EventPattern(ORDER_EVENTS.DELIVERED)
  async handleOrderDelivered(data: OrderDeliveredPayload) {
    this.logger.log(`Order ${data.orderId} delivered to user ${data.userId} at ${data.deliveredAt}`);

    // Order is now eligible for review
    // The actual review creation will be handled by the createReview endpoint
    // when the user decides to submit a review
  }
}
