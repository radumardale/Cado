import { compare } from 'bcrypt';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getServerSession, type Session } from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import connectMongo from './connect-mongo';
import { User } from '@/models/user/user';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'username', type: 'username', required: true },
        password: { label: 'password', type: 'password', required: true },
      },
      async authorize(credentials) {
        await connectMongo();

        let user = null;
        try {
          user = await User.findOne({ username: credentials?.username });
        } catch (e) {
          if (e) {
            return null;
          }
        }

        if (!user) return null;

        const passwordCorrect = await compare(credentials?.password || '', user.password);

        if (!passwordCorrect) return null;

        return {
          id: user.id,
          username: user.username,
        };
      },
    }),
  ],

  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (trigger === 'update') token.user = session.user;

      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      // Extend session with user from token
      // Using type assertion as NextAuth's Session type doesn't include our custom user property
      return {
        ...session,
        user: token.user,
      } as Session;
    },
  },
};

export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
