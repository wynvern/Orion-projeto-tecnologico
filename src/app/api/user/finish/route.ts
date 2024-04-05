// twinny!

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{
					user: null,
					message: "Not authorized",
					type: "Missing authorization",
				},
				{ status: 401 }
			);
		}

		const body = await req.json();
		const { username } = body;

		console.log(username);

		const existingUser = await db.user.findFirst({
			where: {
				username,
			},
		});

		if (existingUser) {
			return NextResponse.json(
				{
					user: null,
					message: "username-in-use",
				},
				{ status: 409 }
			);
		}

		console.log("novo nome: " + username);

		await db.user.update({
			where: { email: session.user.email ?? "" },
			data: { username },
		});

		return NextResponse.json(
			{ message: "User finished succsessfully", newName: username },
			{ status: 201 }
		);
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Someting went wrong..." },
			{ status: 500 }
		);
	}
};
