"use client";

import { Image, Link } from "@nextui-org/react";
import {
	EllipsisHorizontalIcon,
	PencilIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import CustomizeProfile from "@/components/modal/CustomizeProfile";
import { useSession } from "next-auth/react";
import UserCard from "@/components/Cards/UserCard";

export default function UserPage({ params }: { params: { username: string } }) {
	const [user, setUser] = useState({
		username: "",
		name: "",
		image: "",
		bio: "",
		banner: "",
	});

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
			<UserCard user={user} />
		</div>
	);
}
