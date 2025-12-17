export const AUTH_PATTERNS = {
  REGISTER: { cmd: 'auth.register' },
  LOGIN: { cmd: 'auth.login' },
  LOGOUT: { cmd: 'auth.logout' },
  REFRESH_TOKEN: { cmd: 'auth.token.refresh' },
  FORGOT_PASSWORD: { cmd: 'auth.password.forgot' },
  RESET_PASSWORD: { cmd: 'auth.password.reset' },
  VERIFY_OTP: { cmd: 'auth.otp.verify' },
  RESEND_OTP: { cmd: 'auth.otp.resend' },
  VALIDATE_TOKEN: { cmd: 'auth.token.validate' },
} as const;
