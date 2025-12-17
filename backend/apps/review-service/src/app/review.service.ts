import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Review, ReviewImage, Order, Restaurant } from '@backend/database';
import { ReviewCreatedEvent, REVIEW_EVENTS } from '@backend/contracts';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ReviewImage)
    private readonly imageRepository: Repository<ReviewImage>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createReview(userId: string, orderId: string, foodRating: number, deliveryRating: number, comment: string, isAnonymous: boolean, imageUrls: string[]) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user_id: userId },
      relations: ['delivery'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const existingReview = await this.reviewRepository.findOne({
      where: { order_id: orderId },
    });

    if (existingReview) {
      throw new BadRequestException('Review already exists for this order');
    }

    const review = this.reviewRepository.create({
      order_id: orderId,
      user_id: userId,
      restaurant_id: order.restaurant_id,
      driver_id: order.delivery?.driver_id,
      food_rating: foodRating,
      delivery_rating: deliveryRating,
      comment,
      is_anonymous: isAnonymous || false,
    });

    await this.reviewRepository.save(review);

    if (imageUrls && imageUrls.length > 0) {
      const images = imageUrls.map((url, index) => ({
        review_id: review.id,
        image_url: url,
        display_order: index,
      }));

      await this.imageRepository.save(images);
    }

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: order.restaurant_id },
    });

    if (restaurant) {
      const reviews = await this.reviewRepository.find({
        where: { restaurant_id: restaurant.id },
      });

      const totalRating = reviews.reduce((sum, r) => sum + r.food_rating, 0);
      restaurant.average_rating = totalRating / reviews.length;
      restaurant.total_reviews = reviews.length;

      await this.restaurantRepository.save(restaurant);
    }

    this.eventEmitter.emit(
      REVIEW_EVENTS.CREATED,
      new ReviewCreatedEvent(review.id, order.restaurant_id, foodRating, deliveryRating, review.driver_id)
    );

    return this.getReviewById(review.id);
  }

  async getRestaurantReviews(restaurantId: string, minRating?: number, hasImages?: boolean, page = 1, limit = 20) {
    const queryBuilder = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.images', 'images')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.restaurant_id = :restaurantId', { restaurantId });

    if (minRating) {
      queryBuilder.andWhere('review.food_rating >= :minRating', { minRating });
    }

    if (hasImages) {
      queryBuilder.andWhere('images.id IS NOT NULL');
    }

    const total = await queryBuilder.getCount();

    const data = await queryBuilder
      .orderBy('review.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const reviews = await this.reviewRepository.find({
      where: { restaurant_id: restaurantId },
    });

    const totalRating = reviews.reduce((sum, r) => sum + r.food_rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    return {
      data,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
      average_rating: averageRating,
    };
  }

  async getReviewById(reviewId: string) {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['images', 'user', 'restaurant', 'driver', 'order'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async replyToReview(restaurantId: string, reviewId: string, reply: string) {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, restaurant_id: restaurantId },
      relations: ['images', 'user'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    review.restaurant_reply = reply;
    review.restaurant_replied_at = new Date();

    return this.reviewRepository.save(review);
  }
}
