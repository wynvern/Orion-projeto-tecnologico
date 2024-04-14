import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async (
	req: Request,
	{ params }: { params: { id: string } }
) => {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{ message: "Not authorized", type: "Missing authorization" },
				{ status: 401 }
			);
		}

		const userId = params.id;
		const user = await db.user.findUnique({ where: { id: userId } });

		if (!user) {
			return NextResponse.json(
				{ message: "user-does-not-exist" },
				{ status: 404 }
			);
		}

		const preGroups = await db.inGroups.findMany({
			where: { userId },
		});

		const groups: any = [];

		for (var i = 0; i < preGroups.length; i++) {
			var groupC = await db.group.findFirst({
				where: { id: preGroups[i].groupId },
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
									group: { id: preGroups[i].groupId },
								},
							},
							members: {
								where: {
									group: { id: preGroups[i].groupId },
								},
							},
							posts: {
								where: {
									group: { id: preGroups[i].groupId },
								},
							},
						},
					},
				},
			});
			groups.push(groupC);
		}

		const ownedGroups = await db.group.findMany({
			where: { ownerId: userId },
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
						groupViews: true,
						members: true,
						posts: true,
					},
				},
			},
		});
		return NextResponse.json({ groups, ownedGroups }, { status: 200 });
	} catch (e) {
		console.error(e);
		return Response.json(
			{ message: "Someting went wrong..." },
			{ status: 500 }
		);
	}
};
