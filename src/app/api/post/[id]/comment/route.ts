import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createNotification } from "@/util/createNotification";
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
		const { text, image } = body;
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

		const comment = await db.comment.create({
			data: { text, authorId: session.user.id, postId },
			include: {
				author: { select: { username: true, image: true, id: true } },
			},
		});

		console.log(session.user);

		if (session.user.id !== post.authorId) {
			// NOTIFICATION: create a notification for when someone comments in your post
			await createNotification({
				title: `${session.user.username} comentou em seu post`,
				userId: post.authorId,
				link: `${process.env.NEXTAUTH_URL}/p/${post.id}?highlight=${comment.id}`,
				image: `${session.user.image}`,
				description: `O usuário ${session.user.username} comentou em seu post. Clique para ver.`,
			});
		}

		if (image) {
			const base64Image = Buffer.from(image, "base64");
			const compressedImage = await processAnyImage(base64Image);
			await db.commentMedia.create({
				data: {
					image: compressedImage,
					commentId: comment.id,
					index: 0,
				},
			});
			await db.comment.update({
				where: { id: comment.id },
				data: {
					medias: [
						`${process.env.NEXTAUTH_URL}/api/comment/${comment.id}/media/0`,
					],
				},
			});
		}

		return NextResponse.json(
			{
				message: "Comment created succsessfully",
				comment: {
					...comment,
					medias: [
						`${process.env.NEXTAUTH_URL}/api/comment/${comment.id}/media/0`,
					],
				},
			},
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

// Fetch top-level comments from a post
async function fetchPostComments(postId: string): Promise<any> {
	const comments: any = await db.comment.findMany({
		where: { postId: postId },
		include: {
			author: { select: { username: true, id: true, image: true } },
		},
		orderBy: { createdAt: "desc" },
	});

	for (let i = 0; i < comments.length; i++) {
		const childComments = await fetchCommentReplies(comments[i].id);
		comments[i].childComments = childComments;
	}

	return comments;
}

// Fetch replies to a comment
async function fetchCommentReplies(parentId: string): Promise<any> {
	const comments: any = await db.comment.findMany({
		where: { parentId: parentId },
		include: {
			author: { select: { username: true, id: true, image: true } },
		},
		orderBy: { createdAt: "desc" },
	});

	for (let i = 0; i < comments.length; i++) {
		const childComments = await fetchCommentReplies(comments[i].id);
		comments[i].childComments = childComments;
	}

	return comments;
}

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

		const comments = await fetchPostComments(postId);

		return NextResponse.json({ comments }, { status: 201 });
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Someting went wrong..." },
			{ status: 500 }
		);
	}
};
