"use client";

import { Image, Link, Spinner } from "@nextui-org/react";
import {
	EllipsisHorizontalIcon,
	PencilIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CustomizeProfile from "../modal/CustomizeProfile";

export default function UserCard({ user }: { user: any }) {
	const session = useSession();
	const [imagesLoaded, setImagesLoaded] = useState<number>(0);
	const [customizeProfileModal, setCustomizeProfileModal] = useState(false);
	const [loading, setLoading] = useState(true);

	function handleComponentLoaded() {
		setImagesLoaded((prev) => prev + 1);
	}

	useEffect(() => {
		if (imagesLoaded == 2) onLoad(); // 2 is the amount of components in wait for load
	}, [imagesLoaded]);

	function onLoad() {
		setLoading(false);
	}

	return (
		<div className="w-full h-full flex items-center justify-center">
			<style jsx>{`
				.loader-container {
					opacity: ${loading ? 1 : 0};
					transition: opacity 0.2s ease-in-out;
				}

				.content-container {
					opacity: ${loading ? 0 : 1};
					transition: opacity 0.2s ease-in-out;
				}
			`}</style>

			<div className="loader-container fixed">
				<Spinner size="lg" />
			</div>

			{user.id ? (
				<div
					className={`rounded-large  w-[1000px] h-[400px] flex object-contain relative content-container ${
						user.banner ? "" : "bg-zinc-600"
					}`}
				>
					<Image
						className="absolute w-[700px] h-[400px] rounded-large right-0"
						src={user.banner}
						style={{ objectFit: "cover", opacity: "0.5" }}
						removeWrapper={true}
						onLoad={handleComponentLoaded}
					></Image>
					<div>
						<Image
							draggable={false}
							src={user.image ?? "/brand/default-user.svg"}
							className="h-[400px] w-[400px] object-cover"
							onLoad={handleComponentLoaded}
						/>
					</div>
					<div className="flex-grow p-10 flex flex-col z-10 justify-between">
						<div>
							<div className="flex justify-between">
								<div>
									<div className="flex items-center gap-x-4">
										<div className="bg-emerald-400 h-7 w-7 rounded-2xl z-20 mt-1"></div>
										{session.data?.user.id == user.id ? (
											<Link
												className="text-white"
												onClick={() => {
													setCustomizeProfileModal(
														!customizeProfileModal
													);
												}}
											>
												<div className="flex items-end gap-x-2">
													<h1>{user.name}</h1>
													<PencilIcon className="h-6"></PencilIcon>
												</div>
											</Link>
										) : (
											<div className="flex items-end gap-x-2">
												<h1>{user.name}</h1>
											</div>
										)}
									</div>
								</div>
								<div>
									<EllipsisHorizontalIcon className="h-10"></EllipsisHorizontalIcon>
								</div>
							</div>
							<div className="ml-11 mt-2">
								<p>@{user.username}</p>
							</div>
							<div>
								<p className="max-w-[400px] mt-4">{user.bio}</p>
							</div>
						</div>
						<div className="flex gap-x-4">
							<p>
								<b>Posts </b>0
							</p>
							<p>
								<b>Salvos </b>0
							</p>
							<p>
								<b>Grupos </b>0
							</p>
						</div>
					</div>
				</div>
			) : (
				""
			)}

			<CustomizeProfile
				isActive={customizeProfileModal}
				setIsActive={setCustomizeProfileModal}
				profile={user}
			/>
		</div>
	);
}
