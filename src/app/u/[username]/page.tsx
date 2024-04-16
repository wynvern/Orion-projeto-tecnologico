"use client";

import { useEffect, useState } from "react";
import UserCard from "@/components/Cards/UserCard";
import PostCard from "@/components/Cards/PostCard";
import { CircularProgress, Tab, Tabs, card } from "@nextui-org/react";
import request from "@/util/api";
import LightGroupCard from "@/components/Cards/Light/LightGroupCard";
import { useSession } from "next-auth/react";
import {
	ExclamationTriangleIcon,
	UserGroupIcon,
} from "@heroicons/react/24/solid";
import { Post } from "@/types/Post";

export default function UserPage({ params }: { params: { username: string } }) {
	const [user, setUser] = useState({
		username: "",
		name: "",
		image: "",
		id: "",
		bio: "",
		banner: "",
	});
	const [posts, setPosts] = useState<Post[]>([]);
	const [userGroups, setUserGroups] = useState([]);
	const [skip, setSkip] = useState(0);
	const [currentTab, setCurrentTab] = useState(0);
	const [ownedGroups, setOwnedGroups] = useState([]);
	const session = useSession();
	const [bookmarks, setBookmarks] = useState<Post[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState({ message: "", show: false });
	const [cardLoaded, setCardLoaded] = useState(false);
	const [bookmarkSkip, setBookmarkSkip] = useState(0);
	const [loadedAll, setLoadedAll] = useState({
		posts: false,
		bookmarks: false,
		groups: false,
	});

	async function fetchUser() {
		try {
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
		} catch (error) {
			setError({ message: "Erro ao buscar o usuário.", show: true });
		}
	}

	async function fetchPosts() {
		try {
			if (user.id && !loadedAll.posts) {
				setLoading(true);
				const data = await request(
					`/api/user/${user.id}/post?skip=${skip}`
				);
				if (data.posts.length < 10)
					setLoadedAll({ ...loadedAll, posts: true });
				setPosts(posts.concat(data.posts));
				setSkip(skip + 10);
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
			if (user.id && !loadedAll.bookmarks) {
				setLoading(true);
				const data = await request(
					`/api/user/${user.id}/bookmark?skip=${bookmarkSkip}`
				);
				if (data.bookmarks.length < 10)
					setLoadedAll({ ...loadedAll, bookmarks: true });
				setBookmarks(bookmarks.concat(data.bookmarks));
				setBookmarkSkip(bookmarkSkip + 10);
				setLoading(false);
			}
		} catch (error) {
			setError({
				message: "Erro ao buscar salvos do usuário.",
				show: true,
			});
		}
	}

	async function fetchGroups() {
		try {
			if (user.id && !loadedAll.groups) {
				setLoading(true);
				const data = await request(`/api/user/${user.id}/group`);

				if (data.groups.length < 10)
					setLoadedAll({ ...loadedAll, groups: true });
				setUserGroups(data.groups);
				setOwnedGroups(data.ownedGroups);
				setLoading(false);
			}
		} catch (error) {
			setError({
				message: "Erro ao buscar grupos do usuário.",
				show: true,
			});
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
			if (currentTab == 1) fetchBookmarks();
		}
	};

	if (error.show) {
		return (
			<div className="flex w-full h-full items-center justify-center">
				<div className="flex items-center gap-x-4">
					<div>
						<ExclamationTriangleIcon className="h-20 w-20 text-warning" />
					</div>
					<div>
						<h2>Algo de errado ocorreu :(</h2>
						<p>{error.message}</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className="w-full h-full overflow-y-scroll"
			onScroll={handleScroll}
		>
			<div className="w-full flex items-center flex-col mt-[calc(50vh-200px)]">
				<UserCard
					user={user}
					onUpdate={fetchUser}
					onLoad={() => setCardLoaded(true)}
				/>
				<Tabs
					className={`my-14 ${user.id !== "" ? "" : "hidden"} ${
						cardLoaded ? "opacity-1" : "opacity-0"
					} transition-opacity duration-200`}
					classNames={{ tabList: "w-[500px] h-14", tab: "h-10" }}
					variant="light"
					color="primary"
					onSelectionChange={(e: any) =>
						setCurrentTab(e.split(".")[1])
					}
					aria-label="User tabs"
				>
					<Tab title={<h3>Posts</h3>} aria-label="Posts">
						<div
							className={`flex flex-col gap-y-12 max-w-[1000px] w-full ${
								cardLoaded ? "opacity-1" : "opacity-0"
							} transition-opacity duration-200`}
						>
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
								className={`text-center ${
									user.id !== "" ? "" : "hidden"
								} ${
									cardLoaded ? "opacity-[30%]" : "opacity-0"
								} transition-opacity duration-200`}
							>
								Nenhum post
							</h2>
						) : (
							""
						)}
						<div
							className={`mt-20 ${
								loadedAll.posts ? "opacity-1" : "opacity-0"
							}`}
						>
							<h2 className="text-neutral-500 w-full text-center">
								Sem mais posts
							</h2>
						</div>
						<div
							className={`my-10 max-w-[1000px] flex items-center justify-center ${
								loading ? "opacity-1" : "opacity-0"
							} ${
								cardLoaded ? "opacity-1" : "opacity-0"
							} transition-opacity duration-200`}
						>
							<CircularProgress size="lg" />
						</div>
					</Tab>
					<Tab
						title={<h3>Salvos</h3>}
						aria-label="Salvos"
						className="flex items-center flex-col"
					>
						{" "}
						<div className="flex flex-col gap-y-12 items-center max-w-[1000px]">
							{bookmarks.map((i: any, _: number) => (
								<PostCard
									post={i.post}
									key={_}
									update={fetchPosts}
								/>
							))}
						</div>
						{bookmarks.length < 1 ? (
							<h2
								className={`text-center ${
									user.id !== "" ? "" : "hidden"
								} ${
									cardLoaded ? "opacity-[30%]" : "opacity-0"
								} transition-opacity duration-200`}
							>
								Nada salvo
							</h2>
						) : (
							""
						)}
						<div
							className={`mt-20 ${
								loadedAll.bookmarks ? "opacity-1" : "opacity-0"
							}`}
						>
							<h2 className="text-neutral-500 w-full text-center">
								Sem mais salvos
							</h2>
						</div>
						<div
							className={`my-10 w-[1000px] flex items-center justify-center ${
								loading ? "opacity-1" : "opacity-0"
							} ${
								cardLoaded ? "opacity-1" : "opacity-0"
							} transition-opacity duration-200`}
						>
							<CircularProgress size="lg" />
						</div>
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
								<div className="gap-y-12 flex flex-col">
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
							className={`flex flex-col gap-y-12 justify-center items-center ${
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
							<h2
								className={` text-center ${
									user.id !== "" ? "" : "hidden"
								} ${
									cardLoaded ? "opacity-[30%]" : "opacity-0"
								} transition-opacity duration-200`}
							>
								Nenhum grupo
							</h2>
						) : (
							""
						)}
						<div
							className={`mt-20 ${
								loadedAll.posts ? "opacity-1" : "opacity-0"
							}`}
						>
							<h2 className="text-neutral-500 w-full text-center">
								Sem mais grupos
							</h2>
						</div>
						<div
							className={`my-10 w-[1000px] flex items-center justify-center ${
								loading ? "opacity-1" : "opacity-0"
							} ${
								cardLoaded ? "opacity-1" : "opacity-0"
							} transition-opacity duration-200`}
						>
							<CircularProgress size="lg" />
						</div>
					</Tab>
				</Tabs>
			</div>
		</div>
	);
}
