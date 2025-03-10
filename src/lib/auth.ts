/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import type {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
  } from "next"
import CredentialsProvider from "next-auth/providers/credentials"
import { getServerSession } from "next-auth"
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    pages: {
       signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "username", type: "username", required: true },
                password: { label: "password", type: "password", required: true }
            },
            async authorize (credentials) {
                let user = null;
                try {
                    user = await prisma.user.findFirst({
                        where: {
                            username: credentials?.username,
                        },
                    });
                } catch (e) {
                    if (e) {
                        return null;
                    }
                }

                if (!user) return null;

                const passwordCorrect = await compare(
                    credentials?.password || "",
                    user.password
                );

                if (!passwordCorrect) return null;
        
                return {
                    id: user.id,
                    username: user.username,
                };
            }
        })
    ],

    callbacks: {
        jwt: async ({ token, user, trigger, session }) => {

            if(trigger === 'update') token.user = session.user

            if (user) {
                token.user = user;
              }
            return token
        },
        session: async ({ session, token }: {session: any, token: JWT}) => {
            session.user = token.user
            return session
        }
    }
}

export function auth(
    ...args:
      | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
      | [NextApiRequest, NextApiResponse]
      | []
  ) {
    return getServerSession(...args, authOptions)
  }