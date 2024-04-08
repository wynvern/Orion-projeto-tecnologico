import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const PATCH = async (
	req: Request,
	{ params }: { params: { id: string } }
) => {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{
					message: "missing-authorization",
				},
				{ status: 401 }
			);
		}

		const groupId = params.id;
		const viewerId = session.user.id;
		const currentDate = new Date();

		const groupView = await db.groupView.upsert({
			where: {
				groupId_viewerId: {
					groupId,
					viewerId,
				},
			},
			update: {
				viewedAt: currentDate,
			},
			create: {
				group: {
					connect: {
						id: groupId,
					},
				},
				viewer: {
					connect: {
						id: viewerId,
					},
				},
				viewedAt: currentDate,
			},
		});

		return NextResponse.json({ status: 200 });
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Something went wrong..." },
			{ status: 500 }
		);
	}
};
