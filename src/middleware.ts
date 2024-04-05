import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
	const url = new URL(req.url);
	const session = await getToken({ req });
	console.log(session);

	if (!session) {
		if (
			!url.pathname.includes("/login") &&
			!url.pathname.includes("/signup")
		) {
			return NextResponse.redirect(new URL("/login", req.url));
		}
	} else {
		if (
			url.pathname.includes("/login") ||
			url.pathname.includes("/signup")
		) {
			return NextResponse.redirect(new URL("/", req.url));
		}
		if (!session.username && !url.pathname.includes("/finish")) {
			console.log("usuario não tem um nome de usuário");
			return NextResponse.redirect(new URL("/finish", req.url));
		}
	}
}

export const config = {
	matcher: ["/", "/login", "/signup", "/signout", "/u/:path*", "/finish"],
};
