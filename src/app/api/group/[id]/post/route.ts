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
		const { title, content, images } = body;
		const groupId = params.id;
		const userId = session.user.id;

		const group = await db.group.findUnique({ where: { id: groupId } });

		if (!group) {
			return NextResponse.json(
				{ message: "group-does-not-exist" },
				{ status: 404 }
			);
		}

		const userIsIn = await db.inGroups.findFirst({
			where: { userId, groupId },
		});

		if (!userIsIn && group.ownerId != userId) {
			return NextResponse.json(
				{ message: "user-not-in-group" },
				{ status: 401 }
			);
		}

		if (!title && !content) {
			return NextResponse.json(
				{ message: "cannot-do-anything" },
				{ status: 400 }
			);
		}

		// After validation, create the actual post

		const createCommand = {
			authorId: userId,
			title,
			content,
			groupId,
		};

		const post = await db.post.create({
			data: createCommand,
		});

		if (images) {
			const imagesToSave: string[] = [];

			for (var i = 0; i < images.length; i++) {
				var mediaURL = `${process.env.NEXTAUTH_URL}/api/group/${groupId}/post/${post.id}/media/${i}`;
				imagesToSave.push(mediaURL);

				const imageBuffer = Buffer.from(images[i], "base64");
				const prettifiedImage = await processAnyImage(imageBuffer);

				await db.postMedia.create({
					data: { postId: post.id, image: prettifiedImage },
				});
			}

			await db.post.update({
				where: { id: post.id },
				data: { media: imagesToSave },
			});
		}

		return NextResponse.json(
			{ message: "User created succsessfully" },
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
