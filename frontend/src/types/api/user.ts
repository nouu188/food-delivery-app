import { UserRole, UserStatus } from './auth';

export interface UserProfile {
  id: string;
  email: string;
  phone: string | null;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  status: UserStatus;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}

export interface UserAddress {
  id: string;
  user_id: string;
  label: string; // 'Home', 'Work', etc.
  address_line: string;
  city: string;
  district: string;
  ward: string;
  latitude: number;
  longitude: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressRequest {
  label: string;
  address_line: string;
  city: string;
  district: string;
  ward: string;
  latitude: number;
  longitude: number;
  is_default?: boolean;
}

export interface UpdateAddressRequest {
  label?: string;
  address_line?: string;
  city?: string;
  district?: string;
  ward?: string;
  latitude?: number;
  longitude?: number;
  is_default?: boolean;
}

export interface RegisterDeviceRequest {
  device_token: string; // FCM token
  platform: 'ANDROID' | 'IOS' | 'WEB';
}

export interface FavoriteRestaurant {
  id: string;
  user_id: string;
  restaurant_id: string;
  created_at: string;
  restaurant?: any; // Full restaurant object when populated
}

export interface GetFavoritesResponse {
  items: FavoriteRestaurant[];
}
