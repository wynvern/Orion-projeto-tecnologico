"use client";

import { useEffect, useState } from "react";
import UserCard from "@/components/Cards/UserCard";
import PostCard from "@/components/Cards/PostCard";
import { CircularProgress, Link, Tab, Tabs } from "@nextui-org/react";
import request from "@/util/api";
import LightGroupCard from "@/components/Cards/Light/LightGroupCard";

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
	const [contentLoaded, setContentLoaded] = useState(false);
	const [userGroups, setUserGroups] = useState([]);

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
			const data = await request(`/api/user/${user.id}/post`);
			setPosts(data.posts);
		}
	}

	async function fetchGroups() {
		if (user.id) {
			const data = await request(`/api/user/${user.id}/group`);

			setUserGroups(data.groups);
			setContentLoaded(true);
		}
	}

	useEffect(() => {
		fetchPosts();
		fetchGroups();
	}, [user.id]);

	useEffect(() => {
		fetchUser();
	}, []);

	return (
		<div className="w-full h-full overflow-y-scroll">
			<div className="w-full flex items-center flex-col mt-[calc(50vh-200px)]">
				<UserCard user={user} onUpdate={fetchUser} />
				{contentLoaded ? (
					<Tabs
						className="my-14"
						classNames={{ tabList: "w-[500px] h-14", tab: "h-10" }}
						variant="light"
						color="primary"
					>
						<Tab title={<h3>Posts</h3>}>
							<div className="flex flex-col gap-y-12">
								{posts.map((i: any, _: number) => (
									<PostCard post={i} key={_} />
								))}
							</div>
						</Tab>
						<Tab title={<h3>Salvos</h3>}>HELO</Tab>
						<Tab title={<h3>Grupos</h3>}>
							<div>
								{userGroups.map((i: any, _: number) => (
									<LightGroupCard
										key={_}
										group={i.group}
									></LightGroupCard>
								))}
							</div>
						</Tab>
					</Tabs>
				) : (
					<CircularProgress size="lg" className="mt-14" />
				)}
			</div>
		</div>
	);
}
