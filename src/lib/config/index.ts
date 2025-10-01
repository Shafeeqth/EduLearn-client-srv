export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  environment: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  googlePublicClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  facebookClientId: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  adminJwtSecret: process.env.AUTH_ADMIN_JWT_SECRET,
  adminJwtExpiry: process.env.ADMIN_JWT_TOKEN_EXPIRY,
} as const;
