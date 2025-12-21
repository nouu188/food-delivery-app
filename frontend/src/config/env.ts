export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  API_TIMEOUT: Number(process.env.EXPO_PUBLIC_API_TIMEOUT) || 30000,
  ENV: process.env.EXPO_PUBLIC_ENV || 'development',
  IS_DEV: process.env.EXPO_PUBLIC_ENV === 'development',
  ENABLE_LOGGING: process.env.EXPO_PUBLIC_ENABLE_LOGGING === 'true',
} as const;

// Validate required env vars
if (!ENV.API_URL) {
  throw new Error('EXPO_PUBLIC_API_URL is required');
}
