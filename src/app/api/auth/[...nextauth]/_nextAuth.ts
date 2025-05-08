import { DefaultSession, getServerSession, NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { authService } from '@/services/auth.service';
import { RegisterData } from '@/types/auth/register-user.type';
import { AuthType } from '@/types/user/user.type';
import axios from 'axios';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    refreshToken?: string;
    role?: string;
  }
}

// Removed useAuth2 call as React Hooks cannot be used at the top level

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.role = token.role;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      const registerCredentials: RegisterData = {
        email: user.email!,
        username: user.name!,
        avatar: user.image!,
        role: 'user',
        authType: AuthType.OAUTH_2,
      };
      const response = await axios.post(
        (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api/v1/') + '/auth/auth2',
        registerCredentials,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data) {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return;
      }
      console.log('Response:', JSON.stringify(response.data, null, 2));
    },
    async signOut({ session }) {
      console.log(JSON.stringify({ session }), null, 2);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
};

export const getAuthSession = () => {
  return getServerSession(authOptions);
};
