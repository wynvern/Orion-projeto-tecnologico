import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createNotification } from "@/util/createNotification";
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

		return NextResponse.json(
			{ message: "Comment created succsessfully", comment },
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
