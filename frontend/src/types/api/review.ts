export interface Review {
  id: string;
  order_id: string;
  user_id: string;
  restaurant_id: string;
  rating: number; // 1-5
  comment: string | null;
  photos: string[];
  response: string | null; // Restaurant's response
  responded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewRequest {
  order_id: string;
  restaurant_id: string;
  rating: number;
  comment?: string;
  photos?: string[];
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
  photos?: string[];
}

export interface GetReviewsRequest {
  restaurant_id?: string;
  user_id?: string;
  min_rating?: number;
  page?: number;
  limit?: number;
}

export interface GetReviewsResponse {
  items: Review[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    has_next_page: boolean;
    average_rating: number;
  };
}
