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
		const recents = url.searchParams.get("recents");

		if (recents) {
			const preGroups = await db.groupView.findMany({
				where: { viewerId: session.user.id },
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

			return NextResponse.json(
				{
					groups,
					message: "recent groups retreived succsessfully",
				},
				{ status: 200 }
			);
		}

		const group = await db.group.findFirst({
			where: { name: name as string },
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
							where: { group: { name: name as string } },
						},
						members: { where: { group: { name: name as string } } },
						posts: { where: { group: { name: name as string } } },
					},
				},
			},
		});

		return NextResponse.json(
			{
				group,
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
