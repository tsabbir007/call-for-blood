import NextAuth, { type NextAuthConfig } from "next-auth";

const authConfig: NextAuthConfig = {
    pages: { signIn: '/login' },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            if (nextUrl.pathname.startsWith('/profile')) {
                return isLoggedIn;
            }
            return true;
        },
    },
    providers: [],
};

export default NextAuth(authConfig).auth;

export const config = {
    matcher: ['/profile', '/((?!api|_next/static|_next/image|login).*)'],
};