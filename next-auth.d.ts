import "next-auth/jwt";
import { DefaultSession } from "next-auth";

declare module "next-auth/jwt" {
	interface JWT {
		role: string;
		username: string;
	}
}

declare module "next-auth" {
	interface Session {
		user: {
			role?: string;
			id: string;
			fullName?: string;
			banner?: string;
			username?: string;
		} & DefaultSession["user"];
	}

	interface User {
		role?: string;
		id: string;
		fullName?: string;
		banner?: string;
		username?: string;
	}
}
