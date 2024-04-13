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
		const recents = url.searchParams.get("recents");

		if (recents) {
			const recentGroups = await db.groupView.findMany({
				where: { viewerId: session.user.id },
				orderBy: { viewedAt: "desc" },
				include: { group: true },
			});

			const groups = recentGroups.map((recentGroup) => recentGroup.group);

			const groupsWithViews = await Promise.all(
				groups.map(async (group) => {
					const uniqueViewsCount = await db.groupView.count({
						where: { groupId: group.id },
					});
					return { ...group, views: uniqueViewsCount }; // Add the views field to each group
				})
			);

			const groupsWithParticipants = await Promise.all(
				groupsWithViews.map(async (group) => {
					const uniqueViewsCount = await db.inGroups.count({
						where: { groupId: group.id },
					});
					return { ...group, participants: uniqueViewsCount }; // Add the participants field to each group
				})
			);

			return NextResponse.json(
				{
					groups: groupsWithParticipants,
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

		console.log(group);

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
