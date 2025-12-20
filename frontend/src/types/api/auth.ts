// Enums matching backend
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  RESTAURANT_OWNER = 'RESTAURANT_OWNER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE',
}

export enum OtpType {
  EMAIL_VERIFY = 'EMAIL_VERIFY',
  PHONE_VERIFY = 'PHONE_VERIFY',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role?: UserRole;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
}

export interface VerifyOtpRequest {
  identifier: string; // email or phone
  otp: string;
  type: OtpType;
}

export interface ResendOtpRequest {
  identifier: string;
  type: OtpType;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  refresh_token: string;
}

// Response types
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    status: UserStatus;
  };
}

export interface RegisterResponse {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}
