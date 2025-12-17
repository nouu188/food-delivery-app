export interface AuthenticatedRequest {
  user: {
    id: string;
    email: string;
    role: string;
    restaurant_id?: string;
  };
}
