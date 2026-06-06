import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authApi } from '@/lib/api';
import { Role } from '@/types';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
      responderType?: 'medical' | 'security' | 'driver';
    };
  }
  interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    responderType?: 'medical' | 'security' | 'driver';
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    role: Role;
    userId: string;
    responderType?: 'medical' | 'security' | 'driver';
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await authApi.login({
          email: credentials.email,
          password: credentials.password,
        });

        if (!res.success || !res.data) return null;

        const { user, accessToken, refreshToken } = res.data as any;
        
        // Determine responderType based on role
        let responderType: 'medical' | 'security' | 'driver' | undefined;
        if (user.role === 'medical_officer') responderType = 'medical';
        else if (user.role === 'security_officer') responderType = 'security';
        else if (user.role === 'driver') responderType = 'driver';
        
        return {
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: user.role as Role,
          responderType,
          accessToken,
          refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.userId = user.id;
        token.responderType = user.responderType;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user.id = token.userId;
      session.user.role = token.role;
      session.user.responderType = token.responderType;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt', maxAge: 30 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};
