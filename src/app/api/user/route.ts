import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
	try {
		const body = await req.json();
		const { email, password } = body;

		const existingEmail = await db.user.findUnique({
			where: {
				email: email,
			},
		});

		if (existingEmail) {
			return NextResponse.json(
				{
					user: null,
					message: "email-in-use",
				},
				{ status: 409 }
			);
		}

		if (password.length < 8) {
			return NextResponse.json(
				{
					user: null,
					message: "weak-password",
				},
				{ status: 400 }
			);
		}

		const hashedPassword = await hash(password, 10);
		await db.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		});

		return NextResponse.json(
			{ message: "User created succsessfully" },
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

export const PATCH = async (req: Request) => {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{ message: "Not authorized", type: "Missing authorization" },
				{ status: 401 }
			);
		}

		const body = await req.json();
		const { name, bio } = body;

		if (!name && !bio) {
			return NextResponse.json(
				{ message: "cannot-do-anything" },
				{ status: 400 }
			);
		}

		await db.user.update({
			where: { id: session.user.id },
			data: {
				name,
				bio,
			},
		});

		return NextResponse.json(
			{ message: "User created succsessfully" },
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
