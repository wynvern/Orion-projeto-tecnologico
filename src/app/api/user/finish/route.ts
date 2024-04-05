// twinny!

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
	try {
		const body = await req.json();
		const { username } = body;

		const existingUser = await db.user.findUnique({
			where: {
				username,
			},
		});

		if (existingUser) {
			return NextResponse.json(
				{
					user: null,
					message: "Username already in use.",
					type: "username-in-use",
				},
				{ status: 409 }
			);
		}

		await db.user.update({ where: { email }, data: { username } });

		return NextResponse.json(
			{ message: "User finished succsessfully" },
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
