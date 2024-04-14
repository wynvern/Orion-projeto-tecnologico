import { Chip, CircularProgress, Image, Link } from "@nextui-org/react";
import {
	EllipsisHorizontalIcon,
	PencilIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import EnterGroupButton from "../group/EnterGroupButton";
import CustomizeGroup from "../modal/CustomizeGroup";

interface Group {
	banner?: string;
	logo?: string;
	ownerId: string;
	name: string;
	groupName: string;
	description: string;
	_count: {
		posts: number;
		members: number;
		groupViews: number;
	};
	categories: string[];
}

export default function GroupCard({
	group,
	update,
	onLoad,
}: {
	group: Group;
	update: () => void;
	onLoad: () => void;
}) {
	const session = useSession();
	const [imagesLoaded, setImagesLoaded] = useState<number>(0);
	const [customizeGroup, setCustomizeGroup] = useState(false);
	const [loaded, setLoaded] = useState(false);

	// When two images load, show the card
	useEffect(() => {
		const amountToLoad = 1 + (group.banner ? 1 : 0);
		console.log("something loaded");

		if (imagesLoaded == amountToLoad) {
			setLoaded(true);
			onLoad();
		}
	}, [imagesLoaded]);

	return (
		<div className="flex items-center justify-center w-[1000px] h-[400px] relative">
			{/* Styles for loader and content container */}
			<style jsx>{`
				.loader-container {
					opacity: ${loaded ? 0 : 1};
					transition: opacity 0.2s ease-in-out;
				}

				.content-container {
					opacity: ${loaded ? 1 : 0};
					transform: scale(${loaded ? 1 : 1.1});
					transition: all 0.2s ease-in-out;
				}
			`}</style>

			{/* Group content container */}
			<div className="content-container opacity-0 text-white">
				<div
					className={`rounded-large  w-[1000px] h-[400px] flex object-contain relative bg-neutral-900`}
				>
					{/* Group banner image */}
					{group.banner ? (
						<Image
							className={`absolute w-[700px] h-[400px] rounded-large right-0 ${
								loaded ? "" : "!opacity-0"
							}`}
							src={group.banner}
							style={{ objectFit: "cover", opacity: "0.5" }}
							removeWrapper={true}
							alt="banner-group"
							onLoad={() => setImagesLoaded(imagesLoaded + 1)}
							aria-label="Group banner"
						></Image>
					) : (
						""
					)}
					<div className="relative">
						{/* Group logo */}
						<div className="h-[400px] w-[400px]">
							<Image
								draggable={false}
								src={group.logo ?? "/brand/default-group.svg"}
								className="h-[400px] w-[400px] object-cover z-50"
								alt="banner-group"
								onLoad={() => setImagesLoaded(imagesLoaded + 1)}
								aria-label="Group logo"
							/>
						</div>
						<div className="absolute h-[400px] w-[400px] bg-neutral-900 rounded-large top-0 z-20"></div>
					</div>
					<div className="flex-grow p-10 flex flex-col justify-between z-10">
						<div>
							<div className="flex justify-between">
								<div className="grow mr-10">
									<div className="flex items-center gap-x-4 grow">
										<div className="flex items-end grow">
											{/* Group name */}
											{session.data?.user.id ==
											group.ownerId ? (
												<Link
													isDisabled={!loaded}
													className="text-white flex items-end  gap-x-2"
													onClick={() =>
														setCustomizeGroup(true)
													}
													aria-label="Edit group"
												>
													<div className="flex items-center gap-x-2">
														<UserGroupIcon className="h-10" />
														<h1 aria-label="Group name">
															{group.name}
														</h1>
													</div>
													<PencilIcon
														className="h-6"
														aria-label="Edit icon"
													></PencilIcon>
												</Link>
											) : (
												<div className="flex items-center gap-x-2">
													<UserGroupIcon className="h-10" />
													<h1 aria-label="Group name">
														{group.name}
													</h1>
												</div>
											)}
										</div>
									</div>
								</div>
								<div>
									{/* More options */}
									<Link
										className={`text-white ${
											loaded ? "" : "opacity-0"
										}`}
										aria-label="More options"
									>
										<EllipsisHorizontalIcon
											className="h-10"
											aria-label="More options icon"
										></EllipsisHorizontalIcon>
									</Link>
								</div>
							</div>
							<div className=" max-w-60 ml-12">
								{/* Group name */}
								<h3
									className="max-w-60"
									aria-label="Group name"
								>
									{group.groupName}
								</h3>
							</div>
							<div>
								{/* Group description */}
								<p
									className="break-all mt-4"
									aria-label="Group description"
								>
									{group.description}
								</p>
							</div>
						</div>
						<div className="flex justify-between items-end">
							<div className="flex flex-col gap-y-2">
								<div className="flex gap-x-4 items-center w-full">
									{/* Group statistics */}
									<p
										className="flex gap-x-2"
										aria-label="Posts"
									>
										<b>Posts </b>
										{group._count.posts}
									</p>
									<p
										className="flex gap-x-2"
										aria-label="Members"
									>
										<b>Participantes </b>
										{group._count.members}
									</p>
									<p
										className="flex gap-x-2"
										aria-label="Group views"
									>
										<b>Visualizações </b>
										{group._count.groupViews}
									</p>
								</div>
								<div className="flex flex-row gap-x-2">
									{/* Group categories */}
									{group.categories.map(
										(i: string, _: number) => (
											<Chip
												key={_}
												aria-label={`Category ${i}`}
											>
												{i}
											</Chip>
										)
									)}
								</div>
							</div>
							<div className="ml-auto">
								{/* Enter group button */}
								{session.data?.user.id == group.ownerId ? (
									""
								) : (
									<div
										className={`${
											loaded ? "" : "opacity-0"
										}`}
									>
										<EnterGroupButton group={group} />
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Customize group modal */}
					<CustomizeGroup
						isActive={customizeGroup}
						setIsActive={setCustomizeGroup}
						group={group}
						updateGroup={update}
					/>
				</div>
			</div>

			{/* Loader */}
			<div className={`absolute loader-container`}>
				<CircularProgress
					size="lg"
					aria-label="Loading"
				></CircularProgress>
			</div>
		</div>
	);
}
