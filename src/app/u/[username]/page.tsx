"use client";

import { Image, Link } from "@nextui-org/react";
import {
	EllipsisHorizontalIcon,
	PencilIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import CustomizeProfile from "@/components/modal/CustomizeProfile";
import { useSession } from "next-auth/react";

export default function UserPage({ params }: { params: { username: string } }) {
	const [user, setUser] = useState({
		username: "",
		name: "",
		image: "",
		bio: "",
		banner: "",
	});
	const [customizeProfileModal, setCustomizeProfileModal] = useState(false);
	const session = useSession();

	async function fetchUser() {
		try {
			const response = await fetch(
				`/api/query/user?username=${params.username}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				const fetchedUser = data.users[0];

				const updatedImage = fetchedUser.image.replace(
					"=s96-c",
					"=s1000-c"
				);
				setUser({ ...fetchedUser, image: updatedImage });
			}
		} catch (e: any) {
			console.error("Error:", e.message); //mudar
		}
	}

	useEffect(() => {
		fetchUser();
	}, []);

	return (
		<div className="w-full h-full flex items-center justify-center">
			<div
				className="bg-zinc-600 rounded-large w-[1000px] h-[400px] flex object-contain"
				style={{
					backgroundImage: `url(${user.banner})`,
				}}
			>
				<div>
					<Image
						draggable={false}
						src={user.image ?? "/brand/default-user.svg"}
						className="h-[400px] w-[400px] object-cover"
					/>
				</div>
				<div className="flex-grow p-10 flex flex-col justify-between">
					<div>
						<div className="flex justify-between">
							<div>
								<div className="flex items-center gap-x-4">
									<div className="bg-emerald-400 h-7 w-7 rounded-2xl mt-1"></div>
									{session.data?.user.username ==
									params.username ? (
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

			<CustomizeProfile
				isActive={customizeProfileModal}
				setIsActive={setCustomizeProfileModal}
			/>
		</div>
	);
}
