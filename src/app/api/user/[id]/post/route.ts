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

		const posts = await db.post.findMany({
			where: { authorId: userId },
			include: {
				author: true,
				group: { select: { name: true, logo: true, id: true } },
				comments: {
					take: 3,
					distinct: ["authorId"],
					include: {
						author: {
							select: {
								id: true,
								username: true,
								image: true,
							},
						},
					},
				},
				_count: {
					select: {
						comments: { where: { post: { authorId: userId } } },
					},
				},
			},
			orderBy: { createdAt: "desc" },
			take: 10,
			skip,
		});

		return NextResponse.json({ posts: posts }, { status: 201 });
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Someting went wrong..." },
			{ status: 500 }
		);
	}
};
