export const AUTH_PATTERNS = {
  REGISTER: { cmd: 'auth.register' },
  LOGIN: { cmd: 'auth.login' },
  LOGOUT: { cmd: 'auth.logout' },
  REFRESH_TOKEN: { cmd: 'auth.refresh_token' },
  FORGOT_PASSWORD: { cmd: 'auth.forgot_password' },
  RESET_PASSWORD: { cmd: 'auth.reset_password' },
  VERIFY_OTP: { cmd: 'auth.verify_otp' },
  RESEND_OTP: { cmd: 'auth.resend_otp' },
  VALIDATE_TOKEN: { cmd: 'auth.validate_token' },
};
