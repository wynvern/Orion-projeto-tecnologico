import CustomizeProfile from "@/components/modal/CustomizeProfile";
import ReportUser from "@/components/modal/ReportUser";
import type User from "@/types/User";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Image, Link } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import DropdownUser from "./UserDropdown";

export default function UserHeader({
	user,
	onUpdate,
}: {
	user: User;
	onUpdate: () => void;
}) {
	const session = useSession();
	const [customizeProfileModal, setCustomizeProfileModal] = useState(false);
	const [reportModal, setReportModal] = useState(false);

	return (
		<div className="w-full max-w-[1000px] relative">
			<div className="w-full">
				<Image
					src={user.banner}
					removeWrapper={true}
					className="max-h-[330px] w-full object-cover rounded-t-none rounded-none sm:rounded-large"
				/>
			</div>
			{/* This is the user's profile picture */}
			<div className="absolute top-48 left-4 sm:left-10">
				<Image
					src={user.image || "/brand/default-avatar.svg"}
					removeWrapper={true}
					className="max-h-[200px]"
				/>
			</div>
			{/* This is the user's data */}
			<div className="mt-20 pl-4 sm:pl-10 flex flex-col gap-y-2">
				<div className="w-full justify-between flex">
					{user.name ? (
						session.data?.user.id === user.id ? (
							<Link
								className="text-white"
								onClick={() => {
									setCustomizeProfileModal(
										!customizeProfileModal
									);
								}}
							>
								<div className="flex items-end gap-x-2 text-foreground">
									<h1>{user.name}</h1>
									<PencilIcon className="h-6 mb-1" />
								</div>
							</Link>
						) : (
							<div className="flex items-end gap-x-2 text-foreground">
								<h1>{user.name}</h1>
							</div>
						)
					) : null}
					<div>
						<DropdownUser
							user={user}
							setReportModal={setReportModal}
						/>
					</div>
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
