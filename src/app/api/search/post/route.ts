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

		const posts = await db.post.findMany({
			where: { title: { contains: search, mode: "insensitive" } },
			include: {
				group: { select: { name: true, logo: true, id: true } },
				author: true,
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
						comments: {
							where: {
								post: {
									title: {
										contains: search,
										mode: "insensitive",
									},
								},
							},
						},
					},
				},
			},
			orderBy: { createdAt: "desc" },
			take: 10,
			skip,
		});

		return NextResponse.json(
			{ posts, message: "Posts retreived succsessfully" },
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
