import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { processSquareImage } from "@/util/processSquareImage";

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

		const logo = await db.groupProfilePics.findUnique({
			where: { groupId: id },
		});

		if (!logo || !logo.logo) {
			return Response.json(
				{ message: "logo not found" },
				{ status: 404 }
			);
		}

		const imageBuffer = Buffer.from(logo.logo, "base64");
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

		const id = params.id;
		const userId = session.user.id;
		const { logo } = await req.json();

		const userOwnsGroup = await db.group.findFirst({
			where: { ownerId: userId, id },
		});

		if (!userOwnsGroup) {
			return NextResponse.json(
				{ message: "Not authorized", type: "Missing authorization" },
				{ status: 401 }
			);
		}

		if (!logo) {
			return Response.json(
				{ message: "logo data not provided" },
				{ status: 400 }
			);
		}

		const base64Image = Buffer.from(logo, "base64");
		const optimalLogo = await processSquareImage(base64Image);

		await db.groupProfilePics.upsert({
			where: { groupId: id },
			update: { logo: optimalLogo },
			create: { groupId: id, logo: optimalLogo },
		});

		const logoUrl = `${process.env.NEXTAUTH_URL}/api/group/${id}/logo`;

		await db.group.update({
			where: { id },
			data: { logo: logoUrl },
		});

		return NextResponse.json({
			message: "Group logo picture updated successfully",
			url: logoUrl,
		});
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Something went wrong..." },
			{ status: 500 }
		);
	}
};
