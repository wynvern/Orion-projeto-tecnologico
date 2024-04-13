import { db } from "@/lib/db";
import sendMail from "../../../../lib/mail";
import { hash } from "bcrypt";

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
		const body = await req.json();
		const { email } = body;

		if (!email) {
			return Response.json({ message: "email-missing" }, { status: 400 });
		}

		const user = await db.user.findFirst({ where: { email } });

		if (!user) {
			return Response.json(
				{ message: "created" }, // anonymity
				{ status: 200 }
			);
		}

		if (!user.password) {
			return Response.json(
				{ message: "different-oauth" },
				{ status: 400 }
			);
		}

		const existingCode = await db.activeCodeEmail.findFirst({
			where: { email },
		});

		if (existingCode) {
			return Response.json(
				{ message: "request-already-pending" },
				{ status: 409 }
			);
		}

		const newCode = generateRandomString(50);

		const expiryTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes from now

		await db.activeCodeEmail.create({
			data: { code: newCode, email, expiry: new Date(expiryTime) },
		});

		const link = `${
			process.env.NEXTAUTH_URL
		}/new-password?verificationCode=${newCode}&expTime=${new Date().getTime()}`;

		// Send the link to the user's email...

		sendMail(
			email,
			"Atualize sua senha.",
			`
            <h1>Atualize sua senha.</h1>
            <p>Clique no link abaixo para atualizar a sua senha. Sua requisição expira em 5 minutos.</p>
            <a href="${link}">Atualizar senha</a>
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
		const body = await req.json();
		const { newPassword, code } = body;

		const codeEntry = await db.activeCodeEmail.findUnique({
			where: { code },
		});

		if (!codeEntry) {
			return Response.json({ message: "invalid-code" }, { status: 400 });
		}

		const { email, expiry } = codeEntry;
		const currentTime = new Date().getTime();

		if (expiry.getTime() < currentTime) {
			await db.activeCodeEmail.delete({ where: { code } });
			return Response.json({ message: "code-expired" }, { status: 400 });
		}

		const hashedPassword = await hash(newPassword, 10);
		await db.user.update({
			where: { email },
			data: { password: hashedPassword },
		});

		await db.activeCodeEmail.delete({
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
