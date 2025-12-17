import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard, Roles, RolesGuard, AuthenticatedRequest } from '@backend/common';
import {
  UserRole,
  CreateReviewDto,
  ReplyToReviewDto,
  ReviewQueryDto,
} from '@backend/shared';
import { REVIEW_PATTERNS } from '@backend/contracts';

@Controller('reviews')
export class ReviewController {
  constructor(@Inject('REVIEW_SERVICE') private readonly reviewService: ClientProxy) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(@Request() req: AuthenticatedRequest, @Body() data: CreateReviewDto) {
    return firstValueFrom(
      this.reviewService.send(REVIEW_PATTERNS.CREATE_REVIEW, {
        userId: req.user.id,
        ...data,
      })
    );
  }

  @Get('restaurants/:id')
  async getRestaurantReviews(@Param('id') id: string, @Query() query: ReviewQueryDto) {
    return firstValueFrom(
      this.reviewService.send(REVIEW_PATTERNS.GET_RESTAURANT_REVIEWS, {
        restaurantId: id,
        ...query,
      })
    );
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string) {
    return firstValueFrom(this.reviewService.send(REVIEW_PATTERNS.GET_REVIEW_BY_ID, { id }));
  }

  @Put(':id/reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async replyToReview(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: ReplyToReviewDto
  ) {
    return firstValueFrom(
      this.reviewService.send(REVIEW_PATTERNS.REPLY_TO_REVIEW, {
        reviewId: id,
        restaurantId: req.user.restaurant_id,
        ...data,
      })
    );
  }
}
