import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
	try {
		const body = await req.json();
		const { name, description, categories, logo, banner, groupName } = body;

		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{
					message: "missing-authorization",
				},
				{ status: 401 }
			);
		}

		if (!name || !description || !categories) {
			return NextResponse.json(
				{
					message: "missing-required-data",
				},
				{ status: 400 }
			);
		}

		const alreadyUsedName = await db.group.findFirst({
			where: { name },
		});

		if (alreadyUsedName) {
			return NextResponse.json(
				{
					message: "name-already-in-use",
				},
				{ status: 400 }
			);
		}

		const ownerId = session.user.id;

		const newGroup = await db.group.create({
			data: { name, description, ownerId, categories, groupName },
		});

		if (banner !== undefined || logo !== undefined) {
			const dataToUpdate: any = {};
			if (banner !== undefined) dataToUpdate.banner = banner;
			if (logo !== undefined) dataToUpdate.logo = logo;

			const groupProfilePictures = await db.groupProfilePics.upsert({
				where: { groupId: newGroup.id },
				update: dataToUpdate,
				create: {
					groupId: newGroup.id,
					...(logo !== undefined && { logo }),
					...(banner !== undefined && { banner }),
				},
			});
		}

		const bannerUrl = `${process.env.NEXTAUTH_URL}/api/group/${newGroup.id}/banner`;
		const logoUrl = `${process.env.NEXTAUTH_URL}/api/group/${newGroup.id}/logo`;

		const dataToUpdate: any = {};

		if (banner !== undefined) {
			dataToUpdate.banner = bannerUrl;
		}
		if (logo !== undefined) {
			dataToUpdate.logo = logoUrl;
		}
		if (banner || logo) {
			await db.group.update({
				where: { id: newGroup.id },
				data: dataToUpdate,
			});
		}

		return NextResponse.json(
			{ newGroup, message: "Group created succsessfully" },
			{ status: 200 }
		);
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Someting went wrong..." },
			{ status: 500 }
		);
	}
};
