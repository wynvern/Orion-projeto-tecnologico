import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
	try {
		const url = new URL(req.url);
		const search = url.searchParams.get("search");
		const skip = Number(url.searchParams.get("skip"));

		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{
					message: "missing-authorization",
				},
				{ status: 401 }
			);
		}

		if (!search) {
			return NextResponse.json(
				{
					message: "missing-required-data",
				},
				{ status: 400 }
			);
		}

		const users = await db.user.findMany({
			where: { username: { contains: search, mode: "insensitive" } },
			skip,
			take: 10,
		});

		return NextResponse.json(
			{ users, message: "users retreived succsessfully" },
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
