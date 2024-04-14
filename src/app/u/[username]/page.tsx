"use client";

import { use, useEffect, useState } from "react";
import UserCard from "@/components/Cards/UserCard";
import PostCard from "@/components/Cards/PostCard";
import { CircularProgress, Link, Tab, Tabs } from "@nextui-org/react";
import request from "@/util/api";
import LightGroupCard from "@/components/Cards/Light/LightGroupCard";
import { useSession } from "next-auth/react";
import { UserGroupIcon } from "@heroicons/react/24/solid";

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
	const [ownedGroups, setOwnedGroups] = useState([]);
	const session = useSession();
	const [bookmarks, setBookmarks] = useState([]);
	const [loading, setLoading] = useState(false);

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
	}

	async function fetchPosts() {
		if (user.id) {
			setLoading(true);
			const data = await request(
				`/api/user/${user.id}/post?skip=${skip}`
			);
			setPosts(posts.concat(data.posts));
			setSkip(skip + 10);
			setLoading(false);
		}
	}

	async function fetchBookmarks() {
		if (user.id) {
			const data = await request(
				`/api/user/${user.id}/bookmark?skip=${skip}`
			);
			setBookmarks(posts.concat(data.bookmarks));
			setSkip(skip + 10);
		}
	}

	async function fetchGroups() {
		if (user.id) {
			const data = await request(`/api/user/${user.id}/group`);

			setUserGroups(data.groups);
			setContentLoaded(true);
			setOwnedGroups(data.ownedGroups);
		}
	}

	useEffect(() => {
		fetchPosts();
		fetchGroups();
		fetchBookmarks();
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
					className={`my-14 ${user.id !== "" ? "" : "hidden"}`}
					classNames={{ tabList: "w-[500px] h-14", tab: "h-10" }}
					variant="light"
					color="primary"
					onSelectionChange={(e: any) =>
						setCurrentTab(e.split(".")[1])
					}
					aria-label="User tabs"
				>
					<Tab title={<h3>Posts</h3>} aria-label="Posts">
						<div className="flex flex-col gap-y-12">
							{posts.map((i: any, _: number) => (
								<PostCard
									post={i}
									key={_}
									update={fetchPosts}
								/>
							))}
						</div>
						{posts.length < 1 ? (
							<h2
								className={`opacity-[30%] ${
									user.id !== "" ? "" : "hidden"
								}`}
							>
								Nenhum post
							</h2>
						) : (
							""
						)}
						<div
							className={`my-10 w-[1000px] flex items-center justify-center ${
								loading ? "opacity-1" : "opacity-0"
							}`}
						>
							<CircularProgress size="lg" />
						</div>
					</Tab>
					<Tab title={<h3>Salvos</h3>} aria-label="Salvos">
						{" "}
						<div className="flex flex-col gap-y-12">
							{bookmarks.map((i: any, _: number) => (
								<PostCard
									post={i.post}
									key={_}
									update={fetchPosts}
								/>
							))}
						</div>
						{bookmarks.length < 1 ? (
							<h2 className="opacity-[30%]">Nada salvo</h2>
						) : (
							""
						)}
					</Tab>
					<Tab title={<h3>Grupos</h3>} aria-label="Grupos">
						{ownedGroups.length >= 1 ? (
							<div className="bg-primary p-14 gap-y-10 flex flex-col rounded-large text-white">
								<div className="flex gap-x-2 items-center">
									<UserGroupIcon className="h-12" />
									<h1>
										{session.data?.user.id === user.id
											? "Seus grupos"
											: `Grupos de ${user.username}`}
									</h1>
								</div>
								<div className="gap-y-12">
									{ownedGroups.map((i: any, _: number) => (
										<LightGroupCard
											key={_}
											group={i}
										></LightGroupCard>
									))}
								</div>
							</div>
						) : (
							""
						)}
						<div
							className={`gap-y-12 ${
								ownedGroups.length >= 1 ? "mt-12" : ""
							}`}
						>
							{userGroups.map((i: any, _: number) => (
								<LightGroupCard
									key={_}
									group={i}
								></LightGroupCard>
							))}
						</div>
						{ownedGroups.length < 1 && userGroups.length < 1 ? (
							<h2 className="opacity-[30%]">Nenhum grupo</h2>
						) : (
							""
						)}
					</Tab>
				</Tabs>
			</div>
		</div>
	);
}
