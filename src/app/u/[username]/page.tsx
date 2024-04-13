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
	const [skip, setSkip] = useState(0);
	const [currentTab, setCurrentTab] = useState(0);

	async function fetchUser() {
		const data = await request(
			`/api/query/user?username=${params.username}`
		);
		const fetchedUser = data.user;
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
				? fetchedUser.banner + `?timestamp=${new Date().getTime()}`
				: fetchedUser.banner,
		});
		console.log(data.users);
	}

	async function fetchPosts() {
		if (user.id) {
			const data = await request(
				`/api/user/${user.id}/post?skip=${skip}`
			);
			setPosts(posts.concat(data.posts));
			setSkip(skip + 10);
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

	const handleScroll = (e: any) => {
		const bottom =
			Math.ceil(e.target.scrollTop) + e.target.clientHeight >=
			e.target.scrollHeight;
		if (bottom) {
			if (currentTab == 0) fetchPosts();
		}
	};

	return (
		<div
			className="w-full h-full overflow-y-scroll"
			onScroll={handleScroll}
		>
			<div className="w-full flex items-center flex-col mt-[calc(50vh-200px)]">
				<UserCard user={user} onUpdate={fetchUser} />
				<Tabs
					className="my-14"
					classNames={{ tabList: "w-[500px] h-14", tab: "h-10" }}
					variant="light"
					color="primary"
					onSelectionChange={(e: any) => setCurrentTab(e)}
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
			</div>
		</div>
	);
}
