"use client";

import {
	Button,
	CircularProgress,
	Image,
	Link,
	Progress,
} from "@nextui-org/react";
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
	update,
}: {
	group: any;
	update: () => void;
}) {
	const session = useSession();
	const [imagesLoaded, setImagesLoaded] = useState<number>(0);
	const [customizeGroup, setCustomizeGroup] = useState(false);
	const [loaded, setLoaded] = useState(false);

	function handleComponentLoaded() {
		console.log("something has loaded...");
		setImagesLoaded((prev) => prev + 1);
	}

	useEffect(() => {
		const amountToLoad = session.data?.user.id == group.ownerId ? 2 : 3;
		console.log(amountToLoad, imagesLoaded);
		if (imagesLoaded == amountToLoad) {
			setLoaded(true);
			console.log("we loaded");
		} // 3 is the amount of components in wait for load
	}, [imagesLoaded]);

	return (
		<div className="flex items-center justify-center w-[1000px] h-[400px] relative">
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

			<div className="content-container opacity-0">
				<div
					className={`rounded-large  w-[1000px] h-[400px] flex object-contain relative bg-neutral-900`}
				>
					<Image
						className={`absolute w-[700px] h-[400px] rounded-large right-0 ${
							loaded ? "" : "!opacity-0"
						}`}
						src={group.banner}
						style={{ objectFit: "cover", opacity: "0.5" }}
						removeWrapper={true}
						alt="banner-group"
						onLoad={handleComponentLoaded}
					></Image>
					<div className="relative">
						<div className="h-[400px] w-[400px]">
							<Image
								draggable={false}
								src={group.logo ?? "/brand/default-group.svg"}
								className="h-[400px] w-[400px] object-cover z-50"
								alt="banner-group"
								onLoad={handleComponentLoaded}
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
											{session.data?.user.id ==
											group.ownerId ? (
												<Link
													isDisabled={!loaded}
													className="text-white flex items-end  gap-x-2"
													onClick={() =>
														setCustomizeGroup(true)
													}
												>
													<div className="flex items-center gap-x-2">
														<UserGroupIcon className="h-10" />
														<h1>
															{group.groupName}
														</h1>
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
									<Link
										className={`text-white ${
											loaded ? "" : "opacity-0"
										}`}
									>
										<EllipsisHorizontalIcon className="h-10"></EllipsisHorizontalIcon>
									</Link>
								</div>
							</div>
							<div className="mt-2 max-w-60">
								<p className="max-w-60">@{group.name}</p>
							</div>
							<div>
								<p className="break-all mt-4">
									{group.description}
								</p>
							</div>
						</div>
						<div className="flex justify-between items-end">
							<div className="flex gap-x-4 items-center w-full">
								<p className="flex gap-x-2">
									<b>Posts </b>0
								</p>
								<p className="flex gap-x-2">
									<b>Participantes </b>
									{group.participants}
								</p>
								<p className="flex gap-x-2">
									<b>Visualizações </b>
									{group.views}
								</p>
							</div>
							<div className="ml-auto">
								{session.data?.user.id == group.ownerId ? (
									""
								) : (
									<div
										className={`${
											loaded ? "" : "opacity-0"
										}`}
									>
										<EnterGroupButton
											group={group}
											onLoad={handleComponentLoaded}
										/>
									</div>
								)}
							</div>
						</div>
					</div>

					<CustomizeGroup
						isActive={customizeGroup}
						setIsActive={setCustomizeGroup}
						group={group}
						updateGroup={update}
					/>
				</div>
			</div>

			<div className={`absolute loader-container`}>
				<CircularProgress size="lg"></CircularProgress>
			</div>
		</div>
	);
}
