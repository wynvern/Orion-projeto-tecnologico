import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";

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
		const id = params.id;

		if (!id) {
			return Response.json(
				{ message: "id not provided", type: "id-missing" },
				{ status: 400 }
			);
		}

		const banner = await db.userProfilePictures.findUnique({
			where: { userId: id },
		});

		if (!banner || !banner.banner) {
			return Response.json(
				{ message: "banner not found" },
				{ status: 404 }
			);
		}

		const imageBuffer = Buffer.from(banner.banner, "base64");
		const headers = {
			"Content-Type": "image/png",
		};

		return new Response(imageBuffer, { headers, status: 200 });
	} catch (e) {
		return Response.json(
			{ message: "Someting went wrong..." },
			{ status: 500 }
		);
	}
};
