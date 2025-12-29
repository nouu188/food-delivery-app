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
  HttpException,
  HttpStatus,
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
    try {
      return await firstValueFrom(
        this.reviewService.send(REVIEW_PATTERNS.CREATE_REVIEW, {
          userId: req.user.id,
          ...data,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 409) {
        throw new HttpException(
          errorData.message || 'Review already exists',
          HttpStatus.CONFLICT,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid review data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to create review',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal review error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('restaurants/:id')
  async getRestaurantReviews(@Param('id') id: string, @Query() query: ReviewQueryDto) {
    try {
      return await firstValueFrom(
        this.reviewService.send(REVIEW_PATTERNS.GET_RESTAURANT_REVIEWS, {
          restaurantId: id,
          ...query,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Restaurant not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get restaurant reviews',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal review error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string) {
    try {
      return await firstValueFrom(this.reviewService.send(REVIEW_PATTERNS.GET_REVIEW_BY_ID, { id }));
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Review not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to get review',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal review error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id/reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  async replyToReview(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() data: ReplyToReviewDto
  ) {
    try {
      return await firstValueFrom(
        this.reviewService.send(REVIEW_PATTERNS.REPLY_TO_REVIEW, {
          reviewId: id,
          restaurantId: req.user.restaurant_id,
          ...data,
        })
      );
    } catch (error: any) {
      const errorData = error?.error || error;

      if (errorData?.statusCode === 404) {
        throw new HttpException(
          errorData.message || 'Review not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (errorData?.statusCode === 403) {
        throw new HttpException(
          errorData.message || 'Not authorized to reply to this review',
          HttpStatus.FORBIDDEN,
        );
      }

      if (errorData?.statusCode === 400) {
        throw new HttpException(
          errorData.message || 'Invalid reply data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (errorData?.statusCode) {
        throw new HttpException(
          errorData.message || 'Failed to reply to review',
          errorData.statusCode,
        );
      }

      throw new HttpException(
        'Internal review error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
