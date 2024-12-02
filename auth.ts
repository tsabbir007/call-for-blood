import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: NextAuthConfig = {
    callbacks: {
        async signIn({ user }) {
            try {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email ?? undefined },
                });

                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            email: user.email!,
                            name: user.name!,
                            image: user.image,
                        },
                    });
                }

                return true;
            } catch (error) {
                console.error("Error saving user data: ", error);
                return false;
            }
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt" as const,
    },
};

export const {handlers: {GET, POST}, auth, signIn, signOut} = NextAuth(authOptions);