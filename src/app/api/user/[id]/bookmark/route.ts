import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async (
	req: Request,
	{ params }: { params: { id: string } }
) => {
	try {
		const session = await getServerSession(authOptions);
		const url = new URL(req.url);
		const skip = Number(url.searchParams.get("skip"));

		if (!session) {
			return NextResponse.json(
				{ message: "Not authorized", type: "Missing authorization" },
				{ status: 401 }
			);
		}

		const userId = params.id;
		const user = await db.user.findUnique({ where: { id: userId } });

		if (!user) {
			return NextResponse.json(
				{ message: "user-does-not-exist" },
				{ status: 404 }
			);
		}

		const bookmarks = await db.bookmark.findMany({
			where: { userId },
			include: {
				post: {
					include: {
						author: {
							select: { id: true, image: true, username: true },
						},
					},
				},
			},
			skip,
			take: 10,
		});

		return NextResponse.json({ bookmarks }, { status: 201 });
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Someting went wrong..." },
			{ status: 500 }
		);
	}
};
