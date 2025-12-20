import apiClient from './client';
import {
  Review,
  CreateReviewRequest,
  UpdateReviewRequest,
  GetReviewsRequest,
  GetReviewsResponse,
} from '@/types/api/review';

class ReviewService {
  async getReviews(params?: GetReviewsRequest): Promise<GetReviewsResponse> {
    const response = await apiClient.get('/reviews', { params });
    return response.data;
  }

  async getReviewById(id: string): Promise<Review> {
    const response = await apiClient.get(`/reviews/${id}`);
    return response.data;
  }

  async createReview(data: CreateReviewRequest): Promise<Review> {
    const response = await apiClient.post('/reviews', data);
    return response.data;
  }

  async updateReview(id: string, data: UpdateReviewRequest): Promise<Review> {
    const response = await apiClient.put(`/reviews/${id}`, data);
    return response.data;
  }

  async deleteReview(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response.data;
  }

  async getRestaurantReviews(restaurantId: string, params?: GetReviewsRequest): Promise<GetReviewsResponse> {
    const response = await apiClient.get(`/reviews/restaurant/${restaurantId}`, { params });
    return response.data;
  }

  async getUserReviews(params?: GetReviewsRequest): Promise<GetReviewsResponse> {
    const response = await apiClient.get('/reviews/my-reviews', { params });
    return response.data;
  }
}

export default new ReviewService();
