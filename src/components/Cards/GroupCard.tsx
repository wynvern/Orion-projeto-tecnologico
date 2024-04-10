"use client";

import { Button, Image, Link } from "@nextui-org/react";
import {
	EllipsisHorizontalIcon,
	PencilIcon,
	UserPlusIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import EnterGroupButton from "../group/EnterGroupButton";
import CustomizeGroup from "../modal/CustomizeGroup";

export default function GroupCard({
	group,
	onLoad,
}: {
	group: any;
	onLoad?: () => void;
}) {
	const session = useSession();
	const [imagesLoaded, setImagesLoaded] = useState<number>(0);
	const [customizeGroup, setCustomizeGroup] = useState(false);

	function handleComponentLoaded() {
		setImagesLoaded((prev) => prev + 1);
	}

	useEffect(() => {
		const amountToLoad = session.data?.user.id == group.ownerId ? 2 : 3;
		if (onLoad && imagesLoaded == amountToLoad) onLoad(); // 3 is the amount of components in wait for load
	}, [imagesLoaded]);

	return (
		<div
			className={`rounded-large  w-[1000px] h-[400px] flex object-contain relative ${
				group.banner ? "" : "bg-default-100"
			}`}
		>
			<Image
				className="absolute w-[700px] h-[400px] rounded-large right-0"
				src={group.banner}
				style={{ objectFit: "cover", opacity: "0.5" }}
				removeWrapper={true}
				onLoad={handleComponentLoaded}
				alt="banner-group"
			></Image>
			<div>
				<Image
					draggable={false}
					src={group.logo ?? "/brand/default-group.svg"}
					className="h-[400px] w-[400px] object-cover"
					onLoad={handleComponentLoaded}
					alt="banner-group"
				/>
			</div>
			<div className="flex-grow p-10 flex flex-col justify-between z-10">
				<div>
					<div className="flex justify-between">
						<div>
							<div className="flex items-center gap-x-4">
								<div className="flex items-end">
									{session.data?.user.id == group.ownerId ? (
										<Link
											className="text-white flex items-end  gap-x-2"
											onClick={() =>
												setCustomizeGroup(true)
											}
										>
											<div className="flex items-center gap-x-2">
												<UserGroupIcon className="h-10" />
												<h1>{group.groupName}</h1>
											</div>
											<PencilIcon className="h-6"></PencilIcon>
										</Link>
									) : (
										<div className="flex items-center gap-x-2">
											<UserGroupIcon className="h-10" />
											<h1>{group.name}</h1>
										</div>
									)}
								</div>
							</div>
						</div>
						<div>
							<EllipsisHorizontalIcon className="h-10"></EllipsisHorizontalIcon>
						</div>
					</div>
					<div className="mt-2">
						<p>@{group.name}</p>
					</div>
					<div>
						<p className="max-w-[400px] mt-4">
							{group.description}
						</p>
					</div>
				</div>
				<div className="flex gap-x-4 items-center">
					<p>
						<b>Posts </b>0
					</p>
					<p>
						<b>Participantes </b>
						{group.participants}
					</p>
					<p>
						<b>Visualizações </b>
						{group.views}
					</p>
					<div className="ml-auto">
						{session.data?.user.id == group.ownerId ? (
							""
						) : (
							<EnterGroupButton
								group={group}
								onLoad={handleComponentLoaded}
							/>
						)}
					</div>
				</div>
			</div>

			<CustomizeGroup
				isActive={customizeGroup}
				setIsActive={setCustomizeGroup}
				group={group}
			/>
		</div>
	);
}
