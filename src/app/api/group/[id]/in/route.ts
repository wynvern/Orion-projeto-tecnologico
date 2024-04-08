import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
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
				{
					message: "missing-authorization",
				},
				{ status: 401 }
			);
		}

		const userId = session.user.id;
		const groupId = params.id;

		const linkExists = await db.inGroups.findFirst({
			where: { groupId, userId },
		});

		if (!linkExists) {
			await db.inGroups.create({ data: { groupId, userId } });
		}

		return NextResponse.json(
			{ message: "Entered the group succsessfully if not already" },
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

export const DELETE = async (
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

		const userId = session.user.id;
		const groupId = params.id;

		const linkExists = await db.inGroups.findFirst({
			where: { groupId, userId },
		});

		if (linkExists) {
			await db.inGroups.delete({
				where: { groupId_userId: { groupId, userId } }, // Assuming groupId_userId is the composite primary key
			});
		} else {
			return NextResponse.json(
				{
					message: "user-not-in-group",
				},
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ message: "Exited the group successfully" },
			{ status: 200 }
		);
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Something went wrong..." },
			{ status: 500 }
		);
	}
};

export const GET = async (
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

		const userId = session.user.id;
		const groupId = params.id;

		const linkExists = await db.inGroups.findFirst({
			where: { groupId, userId },
		});

		if (linkExists) {
			return NextResponse.json({ message: "following" }, { status: 200 });
		} else {
			return NextResponse.json(
				{
					message: "not-following",
				},
				{ status: 200 }
			);
		}
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Something went wrong..." },
			{ status: 500 }
		);
	}
};
