export const REVIEW_PATTERNS = {
  CREATE_REVIEW: { cmd: 'review.create' },
  GET_RESTAURANT_REVIEWS: { cmd: 'review.restaurant.get' },
  GET_REVIEW_BY_ID: { cmd: 'review.id.get' },
  REPLY_TO_REVIEW: { cmd: 'review.reply' },
} as const;
