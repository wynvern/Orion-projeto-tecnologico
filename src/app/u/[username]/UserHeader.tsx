import CustomizeProfile from "@/components/modal/CustomizeProfile";
import ReportUser from "@/components/modal/ReportUser";
import type User from "@/types/User";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Button, Image, Link } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DropdownUser from "./UserDropdown";

export default function UserHeader({
	user,
	onUpdate,
	onLoad,
}: {
	user: User;
	onUpdate: () => void;
	onLoad: () => void;
}) {
	const [customizeProfileModal, setCustomizeProfileModal] = useState(false);
	const [reportModal, setReportModal] = useState(false);
	const [imagesLoaded, setImagesLoaded] = useState<number>(0);

	function handleComponentLoaded() {
		setImagesLoaded((prev) => prev + 1);
		console.log("loaded");
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (imagesLoaded === (user.banner ? 2 : 1)) {
			onLoad();
		}
	}, [imagesLoaded]);

	return (
		<div className="w-full max-w-[1000px] relative">
			<div className="w-full">
				{user.banner ? (
					<Image
						src={user.banner}
						removeWrapper={true}
						className="h-[250px] w-full object-cover !rounded-t-none rounded-none sm:rounded-large"
						onLoad={handleComponentLoaded}
					/>
				) : (
					<div className="h-[250px] w-full object-cover !rounded-t-none rounded-none sm:rounded-large bg-default-500" />
				)}
			</div>
			{/* This is the user's profile picture */}
			<div className="absolute top-40 sm:top-28 left-4 sm:left-10">
				<Image
					src={user.image || "/brand/default-user.svg"}
					removeWrapper={true}
					className="max-h-[150px] sm:max-h-[200px]"
					onLoad={handleComponentLoaded}
				/>
			</div>
			<div className="w-full justify-between flex px-4 sm:px-10 pt-4">
				<div />
				<div>
					<DropdownUser
						user={user}
						setReportModal={setReportModal}
						setCustomizeProfileModal={setCustomizeProfileModal}
					/>
				</div>
			</div>
			{/* This is the user's data */}
			<div className="mt-4 px-4 sm:px-10 flex flex-col gap-y-2">
				<div className="w-full justify-between flex">
					{user.name && (
						<div className="flex items-end gap-x-2 text-foreground">
							<h1>{user.name}</h1>
						</div>
					)}
				</div>
				<p className="text-neutral-500">@{user.username}</p>
				<p>{user.bio}</p>
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
