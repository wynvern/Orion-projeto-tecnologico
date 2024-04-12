import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async (
	req: Request,
	{ params }: { params: { id: string; postId: string; index: number } }
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
		const postId = params.postId;
		const index: number = Number(params.index);

		if (!postId) {
			return Response.json(
				{ message: "id not provided", type: "id-missing" },
				{ status: 400 }
			);
		}

		const media = await db.postMedia.findFirst({
			where: { postId, index },
		});

		if (!media || !media.image) {
			return Response.json(
				{ message: "media not found" },
				{ status: 404 }
			);
		}

		const imageBuffer = Buffer.from(media.image, "base64");
		const headers = {
			"Content-Type": "image/png",
		};

		return new Response(imageBuffer, { headers, status: 200 });
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Someting went wrong..." },
			{ status: 500 }
		);
	}
};
