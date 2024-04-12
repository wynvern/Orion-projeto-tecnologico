import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (
	req: Request,
	{ params }: { params: { id: string } }
) => {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{
					message: "missing-authorization",
				},
				{ status: 401 }
			);
		}

		const userId = session.user.id;
		const postId = params.id;

		const post = await db.post.findUnique({ where: { id: postId } });

		if (!post) {
			return NextResponse.json(
				{ message: "Post does not exist" },
				{ status: 404 }
			);
		}

		const linkExists = await db.bookmark.findFirst({
			where: { postId, userId },
		});

		if (!linkExists) {
			await db.bookmark.create({ data: { postId, userId } });
		}

		return NextResponse.json(
			{ message: "Bookmarked the post succsessfully if not already" },
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

export const DELETE = async (
	req: Request,
	{ params }: { params: { id: string } }
) => {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{
					message: "missing-authorization",
				},
				{ status: 401 }
			);
		}

		const userId = session.user.id;
		const postId = params.id;

		const linkExists = await db.bookmark.findFirst({
			where: { postId, userId },
		});

		if (linkExists) {
			await db.bookmark.delete({
				where: { postId_userId: { postId, userId } }, // Assuming postId_userId is the composite primary key
			});
		} else {
			return NextResponse.json(
				{
					message: "post-not-bookmarked",
				},
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ message: "Removed the bookmark successfully" },
			{ status: 200 }
		);
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Something went wrong..." },
			{ status: 500 }
		);
	}
};

export const GET = async (
	req: Request,
	{ params }: { params: { id: string } }
) => {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{
					message: "missing-authorization",
				},
				{ status: 401 }
			);
		}

		const userId = session.user.id;
		const postId = params.id;

		const linkExists = await db.bookmark.findFirst({
			where: { postId, userId },
		});

		if (linkExists) {
			return NextResponse.json(
				{ message: "bookmarked" },
				{ status: 200 }
			);
		} else {
			return NextResponse.json(
				{
					message: "not-bookmarked",
				},
				{ status: 200 }
			);
		}
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Something went wrong..." },
			{ status: 500 }
		);
	}
};
