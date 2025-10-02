'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { SessionProvider } from 'next-auth/react';
import { config } from '../config';

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GoogleOAuthProvider clientId={config.googlePublicClientId!}>{children}</GoogleOAuthProvider>
    </SessionProvider>
  );
}
