import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
	try {
		const url = new URL(req.url);
		const search = url.searchParams.get("search");

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

		const groups = await db.group.findMany({
			where: { name: { contains: search } },
		});

		return NextResponse.json(
			{ groups, message: "groups retreived succsessfully" },
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
