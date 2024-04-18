"use client";

import { useEffect, useState } from "react";
import UserCard from "@/components/Cards/UserCard";
import PostCard from "@/components/Cards/PostCard";
import { CircularProgress, Link, Tab, Tabs } from "@nextui-org/react";
import request from "@/util/api";
import LightGroupCard from "@/components/Cards/Light/LightGroupCard";
import { useSession } from "next-auth/react";
import {
	ExclamationTriangleIcon,
	UserGroupIcon,
} from "@heroicons/react/24/solid";
import TabContent from "./TabContent";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import type User from "@/types/User";
import UserHeader from "./UserHeader";

export default function UserPage({ params }: { params: { username: string } }) {
	const [user, setUser] = useState<User | null>(null);
	const [posts, setPosts] = useState({
		items: [],
		skip: 0,
		loadedAll: false,
	});

	const [bookmarks, setBookmarks] = useState({
		items: [],
		skip: 0,
		loadedAll: false,
	});

	const [userGroups, setUserGroups] = useState({
		items: [],
		loadedAll: false,
	});

	const [ownedGroups, setOwnedGroups] = useState({
		items: [],
		loadedAll: false,
	});

	const [currentTab, setCurrentTab] = useState(0);

	const session = useSession();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState({ message: "", show: false });
	const [pageLoaded, setPageLoaded] = useState(true);

	async function fetchUser() {
		try {
			const data = await request(
				`/api/query/user?username=${params.username}`
			);
			const fetchedUser = data.user;
			const updatedImage = fetchedUser.image?.includes("=s96-c")
				? fetchedUser.image.replace("=s96-c", "=s1000-c")
				: fetchedUser.image;

			setUser({
				...fetchedUser,
				image: fetchedUser.image
					? `${updatedImage}?timestamp=${new Date().getTime()}`
					: fetchedUser.image,
				banner: fetchedUser.banner
					? `${fetchedUser.banner}?timestamp=${new Date().getTime()}`
					: fetchedUser.banner,
			});
		} catch (error) {
			setError({ message: "Erro ao buscar o usuário.", show: true });
		}
	}

	async function fetchPosts() {
		try {
			if (user && !posts.loadedAll) {
				setLoading(true);
				const response = await request(
					`/api/user/${user.id}/post?skip=${posts.skip}`
				);
				console.log(response.posts);
				setPosts({
					...posts,
					items: posts.items.concat(response.posts),
					loadedAll: response.posts.length < 10,
					skip: posts.skip + 10,
				});
				setLoading(false);
			}
		} catch (error) {
			setError({
				message: "Erro ao buscar posts do usuário.",
				show: true,
			});
		}
	}

	async function fetchBookmarks() {
		try {
			if (user && !bookmarks.loadedAll) {
				setLoading(true);
				const response = await request(
					`/api/user/${user.id}/bookmark?skip=${bookmarks.skip}`
				);
				setBookmarks({
					...bookmarks,
					items: response.bookmarks,
					skip: bookmarks.skip + 10,
					loadedAll: response.bookmarks.length < 10,
				});
				setLoading(false);
			}
		} catch (error) {
			setError({
				message: "Error while fetching user's bookmarks.",
				show: true,
			});
		}
	}

	async function fetchGroups() {
		try {
			if (user && !userGroups.loadedAll && !ownedGroups.loadedAll) {
				setLoading(true);
				const response = await request(`/api/user/${user.id}/group`);
				console.log(response);
				setOwnedGroups({
					...ownedGroups,
					items: response.ownedGroups,
					loadedAll: response.ownedGroups.length < 10,
				});
				setUserGroups({
					...userGroups,
					items: response.groups,
					loadedAll: response.groups.length < 10,
				});
				setLoading(false);
			}
		} catch (error) {
			setError({
				message: "Error while fetching user's groups.",
				show: true,
			});
			console.error(error);
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (user) {
			fetchPosts();
			fetchGroups();
			fetchBookmarks();
		}
	}, [user]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchUser();
	}, []);

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		if (e?.target && e.target instanceof HTMLElement) {
			const bottom =
				Math.ceil(e.target.scrollTop) + e.target.clientHeight >=
				e.target.scrollHeight;
			if (bottom) {
				if (currentTab === 0) fetchPosts();
				if (currentTab === 1) fetchBookmarks();
			}
		}
	};

	if (error.show) {
		return (
			<div className="flex w-full h-full items-center justify-center">
				<div className="flex items-center gap-x-4">
					<div>
						<ExclamationTriangleIcon className="h-20 w-20 text-danger" />
					</div>
					<div>
						<h2>Algo de errado ocorreu :(</h2>
						<p>{error.message}</p>
						<Link href="">
							Recarregar
							<ArrowUturnLeftIcon className="pl-2 h-4" />
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div
				className={`fixed w-full h-full flex items-center justify-center transition-opacity duration-300 ${
					pageLoaded ? "opacity-0" : "opacity-1"
				}`}
			>
				<CircularProgress size="lg" />
			</div>
			<div
				className={`w-full h-full transition-opacity px-5 duration-300 ${
					pageLoaded ? "opacity-1" : "opacity-0"
				}`}
				onScroll={handleScroll}
			>
				<div className={"w-full flex items-center flex-col"}>
					{user ? <UserHeader user={user} /> : ""}
					<Tabs
						className={"my-14"}
						classNames={{
							tabList: "max-w-[500px] h-14",
							tab: "h-10",
						}}
						variant="light"
						color="primary"
						onSelectionChange={(e: any) =>
							setCurrentTab(e.split(".")[1])
						}
						aria-label="User tabs"
					>
						<Tab title={<h3>Posts</h3>} aria-label="Posts">
							<TabContent
								loadedAll={posts.loadedAll}
								loading={loading}
								noData={posts.items.length < 1}
								noDataMessage={"Nenhum post."}
							>
								{posts.items.map((i: any, _: number) => (
									<PostCard
										post={i}
										key={_}
										update={fetchPosts}
									/>
								))}
							</TabContent>
						</Tab>
						<Tab title={<h3>Salvos</h3>} aria-label="Salvos">
							<TabContent
								loadedAll={bookmarks.loadedAll}
								loading={loading}
								noData={bookmarks.items.length < 1}
								noDataMessage={"Nada salvo."}
							>
								{bookmarks.items.map((i: any, _: number) => (
									<PostCard
										post={i.post}
										key={_}
										update={fetchPosts}
									/>
								))}
							</TabContent>
						</Tab>
						<Tab title={<h3>Grupos</h3>} aria-label="Grupos">
							<TabContent
								loadedAll={
									userGroups.loadedAll &&
									ownedGroups.loadedAll
								}
								loading={loading}
								noData={
									userGroups.items.length +
										ownedGroups.items.length <
									1
								}
								noDataMessage={"Nenhum post."}
							>
								<>
									{ownedGroups.items.length >= 1 ? (
										<div className="bg-primary p-14 gap-y-10 flex flex-col rounded-large text-white">
											<div className="flex gap-x-2 items-center">
												<UserGroupIcon className="h-12" />
												<h1>
													{session.data?.user?.id ===
													user?.id
														? "Seus grupos"
														: `Grupos de ${user?.username}`}
												</h1>
											</div>
											<div className="gap-y-12 flex flex-col">
												{ownedGroups.items.map(
													(i: any, _: number) => (
														<LightGroupCard
															key={_}
															group={i}
														/>
													)
												)}
											</div>
										</div>
									) : (
										""
									)}
									<div
										className={`flex flex-col gap-y-12 ${
											userGroups.items.length >= 1
												? "mt-12"
												: ""
										}`}
									>
										{userGroups.items.map(
											(i: any, _: number) => (
												<LightGroupCard
													key={_}
													group={i}
												/>
											)
										)}
									</div>
								</>
							</TabContent>
						</Tab>
					</Tabs>
				</div>
			</div>
		</>
	);
}
