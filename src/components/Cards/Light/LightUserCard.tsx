"use client";

import {
	CircularProgress,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Image,
	Link,
	Spinner,
} from "@nextui-org/react";
import {
	EllipsisHorizontalIcon,
	NoSymbolIcon,
	PencilIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ReportUser from "../../modal/ReportUser";
import UserIcon from "@heroicons/react/24/solid/UserIcon";

export default function LightUserCard({ user }: { user: any }) {
	const session = useSession();
	const [imagesLoaded, setImagesLoaded] = useState<number>(0);
	const [loading, setLoading] = useState(true);
	const [reportModal, setReportModal] = useState(false);

	function handleComponentLoaded() {
		setImagesLoaded((prev) => prev + 1);
	}

	useEffect(() => {
		if (user.id) {
			const count = (user.banner ? 1 : 0) + (user.image ? 1 : 0);
			if (imagesLoaded == count) onLoad(); // amount of images to load before showing
		}
	}, [imagesLoaded, user.banner, user.image]);

	function onLoad() {
		setLoading(false);
	}

	return (
		<div className="flex w-[750px] h-[300px] items-center justify-center">
			<style jsx>{`
				.loader-container {
					opacity: ${loading ? 1 : 0};

					transition: opacity 0.2s ease-in-out;
				}

				.content-container {
					opacity: ${loading ? 0 : 1};
					transform: scale(${loading ? "1.1" : "1"});
					transition: all 0.2s ease-in-out;
				}
			`}</style>

			<div className="loader-container fixed">
				<CircularProgress size="lg" />
			</div>

			<Link href={`/u/${user.username}`} className="text-white">
				{user.id ? (
					<div
						className={`rounded-large  w-[750px] h-[300px] flex object-contain relative content-container ${
							user.banner ? "" : "bg-default-100"
						}`}
					>
						<Image
							className="absolute w-[700px] h-[300px] rounded-large right-0"
							src={user.banner}
							style={{
								objectFit: "cover",
								opacity: "0.5",
								visibility: user.banner ? "visible" : "hidden",
							}}
							removeWrapper={true}
							onLoad={handleComponentLoaded}
							alt="user-banner"
						></Image>
						<div>
							<Image
								draggable={false}
								src={user.image ?? "/brand/default-user.svg"}
								className="h-[300px] w-[300px] object-cover z-50"
								onLoad={handleComponentLoaded}
								alt="avatar-user"
							/>
						</div>
						<div className="flex-grow p-10 flex flex-col z-10 justify-between">
							<div>
								<div className="flex justify-between">
									<div>
										<div className="flex items-center gap-x-2">
											<div className="">
												<UserIcon className="h-10 w-10" />
											</div>
											<div className="flex items-end gap-x-2">
												<h1>{user.username}</h1>
											</div>
										</div>
									</div>
									<div>
										<Dropdown
											placement="bottom"
											className="text-foreground"
										>
											<DropdownTrigger>
												<EllipsisHorizontalIcon className="h-10 transition-dropdown"></EllipsisHorizontalIcon>
											</DropdownTrigger>
											<DropdownMenu
												aria-label="User Actions"
												variant="flat"
											>
												{session.data?.user.id ===
												user.id ? (
													<DropdownItem title="Nenhuma ação" />
												) : (
													<DropdownItem
														key="exit"
														description="Reportar o usuário."
														className="border-radius-sys text-danger"
														onClick={() => {
															setReportModal(
																true
															);
														}}
														startContent={
															<NoSymbolIcon className="h-8" />
														}
													>
														Reportar @
														{user.username}
													</DropdownItem>
												)}
											</DropdownMenu>
										</Dropdown>
									</div>
								</div>
								<div className="ml-12 mt-2">
									<h3>{user.name}</h3>
								</div>
								<div>
									<p className="max-w-[300px] mt-4">
										{user.bio}
									</p>
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
			</Link>

			<ReportUser
				isActive={reportModal}
				setIsActive={setReportModal}
				profile={user}
			/>
		</div>
	);
}
