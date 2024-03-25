import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	adapter: PrismaAdapter(db),
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
		}),
	],
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				/*
				 * For adding custom parameters to user in session, we first need to add those parameters
				 * in token which then will be available in the `session()` callback
				 */
				token.role = user.role;
				token.fullName = user.fullName;
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				// ** Add custom params to user in session which are added in `jwt()` callback via `token` parameter
				session.user.role = token.role;
				session.user.fullName = token.fullName as string;
			}

			return session;
		},
	},
};
