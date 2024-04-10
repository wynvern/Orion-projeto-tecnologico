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

		const body = await req.json();
		const { groupName, description } = body;
		const groupId = params.id;
		const userId = session.user.id;

		if (!groupName || !description) {
			// TODO: Validate better
			return NextResponse.json({
				status: 400,
				message: "missing-group-name-description",
			});
		}

		const group = await db.group.findFirst({
			where: { id: groupId, ownerId: userId },
		});

		if (!group) {
			return NextResponse.json(
				{
					message: "group-not-acessible-or-not-found",
				},
				{ status: 404 }
			);
		}

		await db.group.update({
			where: { id: groupId },
			data: { groupName, description },
		});

		return NextResponse.json({ status: 200, message: "group-updated" });
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Something went wrong..." },
			{ status: 500 }
		);
	}
};
