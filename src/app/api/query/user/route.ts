import { removePasswordFields } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
	const url = new URL(req.url);

	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{
					user: null,
					message: "Not authorized",
					type: "Missing authorization",
				},
				{ status: 401 }
			);
		}

		const username = url.searchParams.get("username");

		if (!username) {
			return NextResponse.json(
				{
					user: null,
					message: "username not provided",
					type: "username-not-provided",
				},
				{ status: 400 }
			);
		}

		var userFetched: any = await db.user.findFirst({
			where: {
				username: { contains: username },
			},
			select: {
				id: true,
				name: true,
				banner: true,
				username: true,
				bio: true,
				image: true,
				_count: {
					select: {
						posts: { where: { author: { username } } },
						bookmarks: { where: { user: { username } } },
						groups: { where: { user: { username } } },
					},
				},
			},
		});

		console.log(userFetched);

		if (!userFetched) {
			return NextResponse.json(
				{
					user: null,
					message: "User not found",
					type: "user-not-found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{
				user: userFetched,
				message: "User retreived succsessfully",
			},
			{ status: 200 }
		);
	} catch (e) {
		return Response.json(
			{ message: "Someting went wrong..." },
			{ status: 500 }
		);
	}
};
