import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
	try {
		const body = await req.json();
		const { name, description } = body;

		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{
					message: "missing-authorization",
				},
				{ status: 401 }
			);
		}

		if (!name || !description) {
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
			data: { name, description, ownerId },
		});

		return NextResponse.json(
			{ newGroup, message: "User created succsessfully" },
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
