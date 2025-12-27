export enum RestaurantStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
  logo_url: string | null;
  cover_image_url: string | null;
  average_rating: string;
  total_reviews: number;
  min_order_amount: string;
  delivery_fee: string;
  estimated_prep_time: number; // minutes
  is_open: boolean;
  is_featured: boolean;
  status: RestaurantStatus;
  categories?: RestaurantCategory[];
  operating_hours?: OperatingHours[];
  created_at: string;
  updated_at: string;
}

export interface RestaurantCategory {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  display_order: number;
}

export interface OperatingHours {
  id: string;
  restaurant_id: string;
  day_of_week: number; // 0=Sunday, 6=Saturday
  open_time: string; // HH:MM:SS
  close_time: string; // HH:MM:SS
  is_closed: boolean;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  display_order: number;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: string;
  original_price: string | null; // For discounts
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  preparation_time: number; // minutes
  display_order: number;
  options?: MenuItemOption[];
  created_at: string;
  updated_at: string;
}

export interface MenuItemOption {
  id: string;
  menu_item_id: string;
  option_group: string; // 'Size', 'Spice Level'
  name: string; // 'Large', 'Extra Spicy'
  price_modifier: number; // Can be negative
  is_default: boolean;
  is_required: boolean;
  max_selections: number;
  is_available: boolean;
}

// Request types
export interface SearchRestaurantsRequest {
  category?: string;
  search?: string;
  latitude?: number;
  longitude?: number;
  page?: number;
  limit?: number;
}

export interface SearchRestaurantsResponse {
  data: Restaurant[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetRestaurantsRequest {
  page?: number;
  limit?: number;
  sort_by?: 'popular' | 'rating' | 'name';
  category?: string;
}

export interface GetRestaurantsResponse {
  data: Restaurant[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface CreateRestaurantRequest {
  name: string;
  description?: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  logo_url?: string;
  cover_image_url?: string;
  min_order_amount?: number;
  delivery_fee?: number;
  estimated_prep_time?: number;
}

export interface CreateMenuItemRequest {
  restaurant_id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  preparation_time?: number;
}
