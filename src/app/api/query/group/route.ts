import { removePasswordFields } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
	const url = new URL(req.url);

	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{
					Group: null,
					message: "Not authorized",
					type: "Missing authorization",
				},
				{ status: 401 }
			);
		}

		const name = url.searchParams.get("name");

		if (!name) {
			return NextResponse.json(
				{
					message: "name-not-provided",
				},
				{ status: 400 }
			);
		}

		const groupsFetched = await db.group.findMany({
			where: {
				name: { contains: name },
			},
		});
		if (!groupsFetched) {
			return NextResponse.json(
				{
					message: "Group-not-found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{
				groups: groupsFetched,
				message: "Group retreived succsessfully",
			},
			{ status: 200 }
		);
	} catch (e) {
		return Response.json(
			{ message: "Someting went wrong..." },
			{ status: 500 }
		);
	}
};
