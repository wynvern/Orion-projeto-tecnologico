import { db } from "@/lib/db";
import sendMail from "../../../../lib/mail";
import { hash } from "bcrypt";
const activeCodes: {
	[key: string]: { code: string; email: string; expiry: number };
} = {};

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

function deleteExpiredCodes() {
	const currentTime = new Date().getTime();
	for (const email in activeCodes) {
		if (activeCodes[email].expiry < currentTime) {
			delete activeCodes[email];
		}
	}
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
				{ message: "user-does-not-exist" },
				{ status: 200 }
			);
		}

		if (!user.password) {
			return Response.json(
				{ message: "different-oauth" },
				{ status: 400 }
			);
		}

		if (Object.keys(activeCodes).includes(email)) {
			return Response.json(
				{ message: "request-already-pending" },
				{ status: 409 }
			);
		}

		const newCode = generateRandomString(50);

		const expiryTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes from now
		activeCodes[email] = { code: newCode, email, expiry: expiryTime };

		const link = `${
			process.env.NEXTAUTH_URL
		}/new-password?verificationCode=${newCode}&expTime=${new Date().getTime()}`;

		sendMail(
			email,
			"Recuperação de Conta Orion",
			"Aqui está o seu código " + link
		);

		return Response.json({ message: "request-created" }, { status: 200 });
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
		const body = await req.json();
		const { newPassword, code } = body;

		console.log("activeCodes:", activeCodes); // Log the activeCodes object
		console.log("code:", code); // Log the code value

		// Find the code data using Object.entries()
		const codeData = Object.entries(activeCodes).find(
			([key, value]) => value.code === code
		);

		if (!codeData) {
			return Response.json({ message: "invalid-code" }, { status: 400 });
		}

		const email = codeData[1].email;
		const hashedPassword = await hash(newPassword, 10);
		await db.user.update({
			where: { email },
			data: { password: hashedPassword },
		});

		delete activeCodes[email];

		return Response.json({ message: "request-created" }, { status: 200 });
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Someting went wrong..." },
			{ status: 500 }
		);
	}
};
