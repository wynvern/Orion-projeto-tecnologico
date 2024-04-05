import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import * as fs from "fs/promises";
import path from "path";

export const POST = async (req: Request) => {
	try {
		const body = await req.json();
		const { email, name, password } = body;

		const existingEmail = await db.user.findUnique({
			where: {
				email: email,
			},
		});

		if (existingEmail) {
			return NextResponse.json(
				{
					user: null,
					message: "Email already in use.",
					type: "email-in-use",
				},
				{ status: 409 }
			);
		}

		const existingname = await db.user.findFirst({
			where: {
				name: name,
			},
		});

		if (existingname) {
			return NextResponse.json(
				{
					user: null,
					message: "name already in use.",
					type: "name-in-use",
				},
				{ status: 409 }
			);
		}

		const hashedPassword = await hash(password, 10);
		await db.user.create({
			data: {
				email,
				name,
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
