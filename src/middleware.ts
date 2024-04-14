import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
	const url = new URL(req.url);
	const session = await getToken({ req });

	if (!session) {
		if (
			!url.pathname.includes("/login") &&
			!url.pathname.includes("/signup")
		) {
			return NextResponse.redirect(new URL("/login", req.url));
		}
	} else {
		if (!session.emailVerified && !url.pathname.includes("/verify-email")) {
			return NextResponse.redirect(new URL("/verify-email", req.url));
		}
		if (session.emailVerified && url.pathname.includes("/verify-email")) {
			return NextResponse.redirect(new URL("/", req.url));
		}
		if (session.username && url.pathname.includes("/finish")) {
			return NextResponse.redirect(new URL("/", req.url));
		}
		if (
			url.pathname.includes("/login") ||
			url.pathname.includes("/signup")
		) {
			return NextResponse.redirect(new URL("/", req.url));
		}
		if (!session.username && !url.pathname.includes("/finish")) {
			return NextResponse.redirect(new URL("/finish", req.url));
		}
	}
}

export const config = {
	matcher: [
		"/",
		"/login",
		"/signup",
		"/signout",
		"/u/:path*",
		"/finish",
		"/g/:path*",
		"/bookmarks",
		"/groups",
		"/search",
		"/p/:path*",
		"/verify-email",
	],
};
