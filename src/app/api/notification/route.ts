import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
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

		const notifications = await db.notification.findMany({
			where: {
				userId: session.user.id,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json({
			status: 200,
			message: "notifications-retreived",
			notifications,
		});
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Something went wrong..." },
			{ status: 500 }
		);
	}
};

export const PATCH = async () => {
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

		await db.notification.updateMany({
			where: {
				userId: session.user.id,
			},
			data: {
				viewed: true,
			},
		});

		return NextResponse.json({
			status: 200,
			message: "notifications-set-as-viewed",
		});
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Something went wrong..." },
			{ status: 500 }
		);
	}
};
