import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { processAnyImage } from "@/util/processSquareImage";
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
				{ message: "Not authorized", type: "Missing authorization" },
				{ status: 401 }
			);
		}

		const body = await req.json();
		const { text } = body;
		const postId = params.id;

		const post = await db.post.findUnique({ where: { id: postId } });

		if (!post) {
			return NextResponse.json(
				{ message: "post-does-not-exist" },
				{ status: 404 }
			);
		}

		if (!text) {
			return NextResponse.json(
				{ message: "cannot-do-anything" },
				{ status: 400 }
			);
		}

		// After validation, create the actual post

		await db.comment.create({
			data: { text, authorId: session.user.id, postId },
		});

		return NextResponse.json(
			{ message: "Comment created succsessfully" },
			{ status: 201 }
		);
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Someting went wrong..." },
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
				{ message: "Not authorized", type: "Missing authorization" },
				{ status: 401 }
			);
		}

		const postId = params.id;
		const post = await db.post.findUnique({ where: { id: postId } });

		if (!post) {
			return NextResponse.json(
				{ message: "post-does-not-exist" },
				{ status: 404 }
			);
		}

		// TODO: Remove password
		const posts = await db.comment.findMany({
			where: { postId },
			include: { author: true },
			orderBy: { createdAt: "desc" },
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
