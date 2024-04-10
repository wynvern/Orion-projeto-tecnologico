"use client";

import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Image,
	Link,
	Spinner,
	user,
} from "@nextui-org/react";
import {
	EllipsisHorizontalIcon,
	NoSymbolIcon,
	PencilIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CustomizeProfile from "../modal/CustomizeProfile";
import ReportUser from "../modal/ReportUser";

export default function UserCard({ user }: { user: any }) {
	const session = useSession();
	const [imagesLoaded, setImagesLoaded] = useState<number>(0);
	const [customizeProfileModal, setCustomizeProfileModal] = useState(false);
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
						style={{
							objectFit: "cover",
							opacity: "0.5",
							visibility: user.banner ? "visible" : "hidden",
						}}
						removeWrapper={true}
						onLoad={handleComponentLoaded}
					></Image>
					<div>
						<Image
							draggable={false}
							src={user.image ?? "/brand/default-user.svg"}
							className="h-[400px] w-[400px] object-cover z-50"
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
													<h1>@{user.username}</h1>
													<PencilIcon className="h-6"></PencilIcon>
												</div>
											</Link>
										) : (
											<div className="flex items-end gap-x-2">
												<h1>@{user.username}</h1>
											</div>
										)}
									</div>
								</div>
								<div>
									<Dropdown
										placement="bottom"
										className="dark"
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
														setReportModal(true);
													}}
													startContent={
														<NoSymbolIcon className="h-8" />
													}
												>
													Reportar @{user.username}
												</DropdownItem>
											)}
										</DropdownMenu>
									</Dropdown>
								</div>
							</div>
							<div className="ml-11 mt-2">
								<p>{user.name}</p>
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

			<ReportUser
				isActive={reportModal}
				setIsActive={setReportModal}
				profile={user}
			/>
			<CustomizeProfile
				isActive={customizeProfileModal}
				setIsActive={setCustomizeProfileModal}
				profile={user}
			/>
		</div>
	);
}
