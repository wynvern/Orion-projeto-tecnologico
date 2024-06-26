"use client";

import {
	CircularProgress,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Image,
	Link,
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
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import type User from "@/types/User";

export default function UserCard({
	user,
	onUpdate,
	onLoad,
}: {
	user: User;
	onUpdate: () => void;
	onLoad: () => void;
}) {
	const session = useSession();
	const [imagesLoaded, setImagesLoaded] = useState<number>(0);
	const [customizeProfileModal, setCustomizeProfileModal] = useState(false);
	const [reportModal, setReportModal] = useState(false);

	function handleComponentLoaded() {
		setImagesLoaded((prev) => prev + 1);
		console.log("loaded");
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (imagesLoaded === 2) {
			onLoad();
		}
	}, [imagesLoaded]);

	return (
		<div className="flex w-full max-w-[1000px] h-full items-center justify-center relative">
			<div
				className={
					"rounded-large  w-full h-full flex text-white object-contain relative content-container bg-neutral-900"
				}
			>
				<Image
					className="absolute w-full h-full rounded-large right-0"
					src={user.banner}
					style={{
						objectFit: "cover",
						filter: "brightness(0.4)",
						visibility: user.banner ? "visible" : "hidden",
					}}
					removeWrapper={true}
					onLoad={handleComponentLoaded}
					alt="user-banner"
				/>
				<div>
					<Image
						draggable={false}
						src={user.image ?? "/brand/default-user.svg"}
						className="h-full aspect-square object-cover z-50"
						onLoad={handleComponentLoaded}
						alt="avatar-user"
					/>
				</div>
				<div className="flex-grow p-4 sm:p-10  flex flex-col z-10 justify-between">
					<div>
						<div className="flex justify-between">
							<div>
								<div className="flex items-center gap-x-2">
									<div className="">
										<UserIcon className="h-10 w-10" />
									</div>
									{session.data?.user.id === user.id ? (
										<Link
											className="text-white"
											onClick={() => {
												setCustomizeProfileModal(
													!customizeProfileModal
												);
											}}
										>
											<div className="flex items-end gap-x-2">
												<h1>{user.username}</h1>
												<PencilIcon className="h-6" />
											</div>
										</Link>
									) : (
										<div className="flex items-end gap-x-2">
											<h1>{user.username}</h1>
										</div>
									)}
								</div>
							</div>
							<div>
								<Dropdown
									placement="bottom"
									className="text-foreground"
								>
									<DropdownTrigger>
										<EllipsisHorizontalIcon className="h-10 transition-dropdown" />
									</DropdownTrigger>
									<DropdownMenu
										aria-label="User Actions"
										variant="flat"
									>
										{session.data?.user.id === user.id ? (
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
						<div className="ml-12 mt-2">
							<h3>{user.name}</h3>
						</div>
						<div>
							<p className="max-w-[400px] mt-4">{user.bio}</p>
						</div>
					</div>
					<div className="flex gap-x-4">
						<p>
							<b>Posts </b>
							{user._count.posts}
						</p>
						<p>
							<b>Salvos </b>
							{user._count.bookmarks}
						</p>
						<p>
							<b>Grupos </b>
							{user._count.groups}
						</p>
					</div>
				</div>
			</div>

			<ReportUser
				isActive={reportModal}
				setIsActive={setReportModal}
				profile={user}
			/>
			<CustomizeProfile
				onUpdate={() => onUpdate()}
				isActive={customizeProfileModal}
				setIsActive={setCustomizeProfileModal}
				profile={user}
			/>
		</div>
	);
}
