import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";

export const PATCH = async (req: Request) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ message: "Not authorized", type: "Missing authorization" },
				{ status: 401 }
			);
		}

		const userId = session.user.id;
		const { banner } = await req.json();

		if (!banner) {
			return Response.json(
				{ message: "banner data not provided" },
				{ status: 400 }
			);
		}

		const userProfilePictures = await db.userProfilePictures.upsert({
			where: { userId },
			update: { banner },
			create: { userId, banner },
		});

		const bannerUrl = `${process.env.NEXTAUTH_URL}/api/user/banner/${userId}`;

		await db.user.update({
			where: { id: userId },
			data: { banner: bannerUrl },
		});

		return NextResponse.json({
			message: "Profile banner updated successfully",
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
