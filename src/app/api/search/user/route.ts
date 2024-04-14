import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
	try {
		const url = new URL(req.url);
		const search = url.searchParams.get("search");
		const skip = Number(url.searchParams.get("skip"));

		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{
					message: "missing-authorization",
				},
				{ status: 401 }
			);
		}

		if (!search) {
			return NextResponse.json(
				{
					message: "missing-required-data",
				},
				{ status: 400 }
			);
		}

		const preUsers = await db.user.findMany({
			where: { username: { contains: search, mode: "insensitive" } },
			skip,
			take: 10,
		});

		const users: any = [];

		for (var i = 0; i < preUsers.length; i++) {
			var userC = await db.user.findFirst({
				where: { id: preUsers[i].id },
				select: {
					id: true,
					name: true,
					banner: true,
					username: true,
					bio: true,
					image: true,
					_count: {
						select: {
							posts: {
								where: { author: { id: preUsers[i].id } },
							},
							bookmarks: {
								where: { user: { id: preUsers[i].id } },
							},
							groups: { where: { user: { id: preUsers[i].id } } },
						},
					},
				},
			});
			users.push(userC);
			console.log(userC);
		}

		return NextResponse.json(
			{ users, message: "users retreived succsessfully" },
			{ status: 200 }
		);
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Someting went wrong..." },
			{ status: 500 }
		);
	}
};
