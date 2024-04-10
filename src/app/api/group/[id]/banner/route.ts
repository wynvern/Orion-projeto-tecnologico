import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { processAnyImage } from "@/util/processSquareImage";

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

		const banner = await db.groupProfilePics.findUnique({
			where: { groupId: id },
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

export const PATCH = async (
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

		const userId = session.user.id;
		const id = params.id;
		const { banner } = await req.json();

		if (!banner) {
			return Response.json(
				{ message: "banner data not provided" },
				{ status: 400 }
			);
		}

		const base64Image = Buffer.from(banner, "base64");
		const optmialBanner = await processAnyImage(base64Image);

		const userOwnGroup = await db.group.findFirst({
			where: { ownerId: userId, id },
		});

		if (!userOwnGroup) {
			return NextResponse.json(
				{ message: "Not authorized", type: "Missing authorization" },
				{ status: 401 }
			);
		}

		await db.groupProfilePics.upsert({
			where: { groupId: id },
			update: { banner: optmialBanner },
			create: { groupId: id, banner: optmialBanner },
		});

		const bannerUrl = `${process.env.NEXTAUTH_URL}/api/group/${id}/banner`;

		await db.group.update({
			where: { id },
			data: { banner: bannerUrl },
		});

		return NextResponse.json({
			message: "Group banner updated successfully",
			url: bannerUrl,
		});
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Something went wrong..." },
			{ status: 500 }
		);
	}
};
