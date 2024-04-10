import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { processAnyImage } from "@/util/processSquareImage";
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
				{ message: "Not authorized", type: "Missing authorization" },
				{ status: 401 }
			);
		}

		const reportedId = params.id;
		const { title, content } = await req.json();

		if (!title || !content) {
			return NextResponse.json(
				{
					message: "Missing title or content",
					type: "bad-request-missing-data",
				},
				{ status: 400 }
			);
		}

		const userExists = await db.user.findUnique({
			where: { id: reportedId },
		});

		if (!userExists) {
			return NextResponse.json(
				{
					message: "The user does not exist",
					type: "user-does-not-exists",
				},
				{ status: 400 }
			);
		}

		const reportAlreayDone = await db.report.findFirst({
			where: { reportedUserId: reportedId, creatorId: session.user.id },
		});

		if (reportAlreayDone) {
			return NextResponse.json(
				{
					message: "user-already-reported",
				},
				{ status: 409 }
			);
		}

		await db.report.create({
			data: {
				title,
				content,
				creatorId: session.user.id,
				reportedUserId: reportedId,
			},
		});

		return NextResponse.json({
			message: "Profile was reported",
		});
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Something went wrong..." },
			{ status: 500 }
		);
	}
};
