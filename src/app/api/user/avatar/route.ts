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
		const { avatar } = await req.json();

		if (!avatar) {
			return Response.json(
				{ message: "Avatar data not provided" },
				{ status: 400 }
			);
		}

		const userProfilePictures = await db.userProfilePictures.upsert({
			where: { userId },
			update: { avatar },
			create: { userId, avatar },
		});

		const avatarUrl = `${process.env.NEXTAUTH_URL}/api/user/avatar/${userId}`;

		await db.user.update({
			where: { id: userId },
			data: { image: avatarUrl },
		});

		return NextResponse.json({
			message: "Profile picture updated successfully",
			url: avatarUrl,
		});
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Something went wrong..." },
			{ status: 500 }
		);
	}
};
