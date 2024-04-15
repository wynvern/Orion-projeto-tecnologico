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
		const commentId = params.id;

		const commentCheck = await db.comment.findUnique({
			where: { id: commentId },
		});

		if (!commentCheck) {
			return NextResponse.json(
				{ message: "comment-does-not-exist" },
				{ status: 404 }
			);
		}

		if (!text) {
			return NextResponse.json(
				{ message: "cannot-do-anything" },
				{ status: 400 }
			);
		}

		// After validation, create the actual comment

		const comment = await db.comment.create({
			data: { text, authorId: session.user.id, parentId: commentId },
			include: {
				author: { select: { username: true, image: true, id: true } },
			},
		});

		if (session.user.id !== comment.authorId) {
			// NOTIFICATION: create a notification for when someone comments in your comment
			await createNotification({
				title: `${session.user.username} comentou em seu comentário`,
				userId: comment.authorId,
				link: `${process.env.NEXTAUTH_URL}/c/${commentCheck.id}?highlight=${comment.id}`,
				image: `${session.user.image}`,
				description: `O usuário ${session.user.username} comentou em seu comentário. Clique para ver.`,
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
