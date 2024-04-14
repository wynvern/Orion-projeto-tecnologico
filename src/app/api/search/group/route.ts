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

		const preGroups = await db.group.findMany({
			where: { name: { contains: search } },
		});

		const groups: any = [];

		for (var i = 0; i < preGroups.length; i++) {
			var groupC = await db.group.findFirst({
				where: { id: preGroups[i].id },
				select: {
					name: true,
					groupName: true,
					banner: true,
					logo: true,
					description: true,
					categories: true,
					id: true,
					ownerId: true,
					_count: {
						select: {
							groupViews: {
								where: {
									group: { id: preGroups[i].id },
								},
							},
							members: {
								where: {
									group: { id: preGroups[i].id },
								},
							},
							posts: {
								where: {
									group: { id: preGroups[i].id },
								},
							},
						},
					},
				},
			});
			groups.push(groupC);
		}

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
