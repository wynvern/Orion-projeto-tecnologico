"use client";

import { useEffect, useState } from "react";
import UserCard from "@/components/Cards/UserCard";
import PostCard from "@/components/Cards/PostCard";

export default function UserPage({ params }: { params: { username: string } }) {
	const [user, setUser] = useState({
		username: "",
		name: "",
		image: "",
		id: "",
		bio: "",
		banner: "",
	});
	const [posts, setPosts] = useState([]);

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
				const updatedImage =
					fetchedUser.image && fetchedUser.image.includes("=s96-c")
						? fetchedUser.image.replace("=s96-c", "=s1000-c")
						: fetchedUser.image;

				setUser({
					...fetchedUser,
					image: fetchedUser.image
						? updatedImage + `?timestamp=${new Date().getTime()}`
						: fetchedUser.image,
					banner: fetchedUser.banner
						? fetchedUser.banner +
						  `?timestamp=${new Date().getTime()}`
						: fetchedUser.banner,
				});
			}
		} catch (e: any) {
			console.error("Error:", e.message); //mudar
		}
	}

	async function fetchPosts() {
		if (user.id) {
			try {
				const response = await fetch(`/api/user/${user.id}/post`);

				if (response.ok) {
					const data = await response.json();
					console.log(data);
					setPosts(data.posts);
				}
			} catch (e) {
				console.error(e);
			}
		}
	}

	useEffect(() => {
		fetchPosts();
	}, [user.id]);

	useEffect(() => {
		fetchUser();
	}, []);

	return (
		<div className="w-full h-full flex items-center justify-center flex-col">
			<UserCard user={user} onUpdate={fetchUser} />
			{posts.map((i: any, _: number) => (
				<PostCard post={i} key={_} />
			))}
		</div>
	);
}
