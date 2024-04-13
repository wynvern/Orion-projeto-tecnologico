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
		if (!session) {
			return NextResponse.json(
				{
					message: "Not authorized",
					type: "Missing authorization",
				},
				{ status: 401 }
			);
		}
		const postId = params.id;

		if (!postId) {
			return Response.json(
				{ message: "id not provided", type: "id-missing" },
				{ status: 400 }
			);
		}

		const post = await db.post.findUnique({
			where: { id: postId },
			include: {
				author: { select: { id: true, image: true, username: true } },
				group: { select: { id: true, name: true, logo: true } },
				comments: { include: { author: true } },
			},
		});

		if (!post) {
			return NextResponse.json({
				message: "post-not-found",
				status: 404,
			});
		}

		return NextResponse.json({ post, status: 200 });
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
					message: "Not authorized",
					type: "Missing authorization",
				},
				{ status: 401 }
			);
		}

		const postId = params.id;
		if (!postId) {
			return Response.json(
				{ message: "id not provided", type: "id-missing" },
				{ status: 400 }
			);
		}

		const post = await db.post.findUnique({
			where: { id: postId },
		});

		if (!post) {
			return NextResponse.json({
				message: "post-not-found",
				status: 404,
			});
		}

		// Delete the post
		await db.post.delete({
			where: { id: postId },
		});

		return NextResponse.json({
			message: "Post deleted successfully",
			status: 200,
		});
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Something went wrong..." },
			{ status: 500 }
		);
	}
};
