import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

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
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("missing-data");
				}

				const existingUser = await db.user.findUnique({
					where: {
						email: credentials?.email,
					},
				});
				if (!existingUser) {
					throw new Error("email-not-found");
				}
				if (!existingUser.password) {
					throw new Error("differnt-signin-provider");
				}

				const passwordMatch = await compare(
					credentials.password,
					existingUser.password
				);
				if (!passwordMatch) {
					throw new Error("password-not-match");
				}

				return {
					id: existingUser.id,
					name: existingUser.name,
					email: existingUser.email,
					emailVerified: existingUser.emailVerified,
				};
			},
		}),
	],
	pages: {
		signIn: "/login",
		signOut: "/signout",
	},
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			if (user) {
				// Add custom parameters to token
				token.role = user.role as string;
				token.fullName = user.fullName;
				// Add username to the token
				token.username = user.username;
			}

			if (trigger === "update") {
				token.username = session.username;
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				// Transfer custom params from token to user in session
				session.user.role = token.role;
				session.user.fullName = token.fullName as string;
				// Transfer username to the session
				session.user.username = token.username as string;
			}

			return session;
		},
	},
};
