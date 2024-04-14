import { db } from "@/lib/db";
import sendMail from "../../../../lib/mail";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

function generateRandomString(length: number): string {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
	}
	return result;
}

export const POST = async (req: Request) => {
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

		const email = session.user.email;
		if (!email) {
			return NextResponse.json(
				{
					message: "missing-email",
				},
				{ status: 400 }
			);
		}

		const user = await db.user.findFirst({
			where: { email },
		});

		if (!user) {
			return Response.json(
				{ message: "user-does-not-exist" }, // anonymity
				{ status: 404 }
			);
		}

		// TODO: Users through oauth don't need this

		const existingCode = await db.codeVerifyAccount.findFirst({
			where: { email },
		});

		if (existingCode) {
			return Response.json(
				{ message: "request-already-pending" },
				{ status: 409 }
			);
		}

		const newCode = generateRandomString(5);

		const expiryTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes from now

		await db.codeVerifyAccount.create({
			data: { code: newCode, email, expiry: new Date(expiryTime) },
		});

		// Send the link to the user's email...

		sendMail(
			email,
			"Confirmar seu email.",
			`
            <h1>Confirmar seu email.</h1>
            <p>Utilize o código abaixo para verficar o seu email.</p>
            <a>Seu código de verificação: ${newCode}</a>
         `
		);

		return Response.json(
			{ message: "request-successful" },
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

export const PATCH = async (req: Request) => {
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
		const { code } = body;

		const codeEntry = await db.codeVerifyAccount.findUnique({
			where: { code },
		});

		if (!codeEntry) {
			return Response.json({ message: "invalid-code" }, { status: 400 });
		}

		const { email, expiry } = codeEntry;

		if (session.user.email !== email) {
			return Response.json({ message: "invalid-email" }, { status: 400 });
		}

		const currentTime = new Date().getTime();

		if (expiry.getTime() < currentTime) {
			await db.codeVerifyAccount.delete({ where: { code } });
			return Response.json({ message: "code-expired" }, { status: 400 });
		}

		await db.user.update({
			where: { email },
			data: { emailVerified: new Date() },
		});

		await db.codeVerifyAccount.delete({
			where: { code },
		});

		return Response.json(
			{ message: "request-successful" },
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
