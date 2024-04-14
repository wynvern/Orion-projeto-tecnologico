"use client";

import { CircularProgress, Image, Link } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import EnterGroupButton from "../../group/EnterGroupButton";

export default function LightGroupCard({ group }: { group: any }) {
	const session = useSession();
	const [imagesLoaded, setImagesLoaded] = useState<number>(0);
	const [loaded, setLoaded] = useState(false);

	function handleComponentLoaded() {
		setImagesLoaded((prev) => prev + 1);
	}

	useEffect(() => {
		const amountToLoad =
			1 +
			(session.data?.user.id == group.ownerId ? 0 : 1) +
			(group.banner ? 1 : 0);
		if (imagesLoaded == amountToLoad) {
			setLoaded(true);
		} // 3 is the amount of components in wait for load
	}, [imagesLoaded]);

	return (
		<div className="flex items-center justify-center w-[750px] h-[300px] relative">
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
				<Link href={`/g/${group.name}`} className="text-white">
					<div
						className={`rounded-large  w-[750px] h-[300px] flex object-contain relative bg-neutral-900`}
					>
						{group.banner && (
							<Image
								className={`absolute w-[700px] h-[300px] rounded-large right-0 ${
									loaded ? "" : "!opacity-0"
								}`}
								src={group.banner}
								style={{ objectFit: "cover", opacity: "0.5" }}
								removeWrapper={true}
								alt="banner-group"
								onLoad={handleComponentLoaded}
								aria-label="Group Banner"
							></Image>
						)}
						<div className="relative">
							<div className="h-[300px] w-[300px]">
								<Image
									draggable={false}
									src={
										group.logo ?? "/brand/default-group.svg"
									}
									className="h-[300px] w-[300px] object-cover z-50"
									alt="banner-group"
									onLoad={handleComponentLoaded}
									aria-label="Group Logo"
								/>
							</div>
							<div className="absolute h-[300px] w-[300px] bg-neutral-900 rounded-large top-0 z-20"></div>
						</div>
						<div className="flex-grow p-10 flex flex-col justify-between z-10">
							<div>
								<div className="flex justify-between">
									<div className="grow mr-10">
										<div className="flex items-center gap-x-4 grow">
											<div className="flex items-end grow">
												<div className="flex items-center gap-x-2">
													<UserGroupIcon
														className="h-10"
														aria-label="Group Icon"
													/>
													<h2>{group.name}</h2>
												</div>
											</div>
										</div>
									</div>
									<div></div>
								</div>
								<div className=" max-w-60 ml-12">
									<h3 className="max-w-60">
										{group.groupName}
									</h3>
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
										<b>Posts </b>
										{group._count.posts}
									</p>
									<p className="flex gap-x-2">
										<b>Membros </b>
										{group._count.members}
									</p>
									<p className="flex gap-x-2">
										<b>Views </b>
										{group._count.groupViews}
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
												aria-label="Enter Group Button"
											/>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</Link>
			</div>

			<div className={`absolute loader-container`}>
				<CircularProgress
					size="lg"
					aria-label="Loading"
				></CircularProgress>
			</div>
		</div>
	);
}
