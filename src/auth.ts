import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Role } from '@/types/role/types';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Identifier', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.identifier || !credentials?.password) {
            throw new Error('Identifier and password are required');
          }

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth-admin/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                identifier: credentials.identifier,
                password: credentials.password,
              }),
            },
          );

          if (!response.ok) {
            throw new Error('Invalid credentials');
          }

          const data = await response.json();
          // Return the user object that matches our extended User type
          console.log('user data:', data);
          return {
            id: data.user.id,
            email: data.user.email,
            role: data.user.role,
            accessToken: data.token,
          };
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : 'Authentication failed',
          );
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.email = user.email;
        token.role= user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user = {
          accessToken: token.accessToken as string,
          id: token.id as string,
          email: token.email as string,
          role: token.role as Role,
        };
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
};
