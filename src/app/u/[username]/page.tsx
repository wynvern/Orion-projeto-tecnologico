"use client";

import { useEffect, useState } from "react";
import UserCard from "@/components/Cards/UserCard";
import PostCard from "@/components/Cards/PostCard";
import { Link, Tab, Tabs } from "@nextui-org/react";
import request from "@/util/api";
import LightGroupCard from "@/components/Cards/Light/LightGroupCard";
import { useSession } from "next-auth/react";
import {
	ExclamationTriangleIcon,
	UserGroupIcon,
} from "@heroicons/react/24/solid";
import { Post } from "@/types/Post";
import TabContent from "./TabContent";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

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
	const [bookmarks, setBookmarks] = useState<Post[]>([]);
	const [userGroups, setUserGroups] = useState([]);
	const [ownedGroups, setOwnedGroups] = useState([]);

	const [skip, setSkip] = useState({ bookmark: 0, post: 0 });
	const [currentTab, setCurrentTab] = useState(0);

	const session = useSession();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState({ message: "", show: false });
	const [cardLoaded, setCardLoaded] = useState(false);

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
			if (user.id) {
				setLoading(true);
				const data = await request(
					`/api/user/${user.id}/post?skip=${skip.post}`
				);
				setPosts(posts.concat(data.posts));
				setSkip({ ...skip, post: skip.post + 10 });
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
			if (user.id) {
				setLoading(true);
				const data = await request(
					`/api/user/${user.id}/bookmark?skip=${skip.bookmark}`
				);
				setBookmarks(bookmarks.concat(data.bookmarks));
				setSkip({ ...skip, bookmark: skip.bookmark + 10 });
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
			if (user.id) {
				const data = await request(`/api/user/${user.id}/group`);

				setUserGroups(data.groups);
				setOwnedGroups(data.ownedGroups);
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
						<TabContent
							loading={loading}
							noData={posts.length < 1}
							noDataMessage={"Nenhum post."}
						>
							{posts.map((i: any, _: number) => (
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
							loading={loading}
							noData={posts.length < 1}
							noDataMessage={"Nenhum post."}
						>
							{bookmarks.map((i: any, _: number) => (
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
							loading={loading}
							noData={posts.length < 1}
							noDataMessage={"Nenhum post."}
						>
							<>
								{ownedGroups.length >= 1 ? (
									<div className="bg-primary p-14 gap-y-10 flex flex-col rounded-large text-white">
										<div className="flex gap-x-2 items-center">
											<UserGroupIcon className="h-12" />
											<h1>
												{session.data?.user.id ===
												user.id
													? "Seus grupos"
													: `Grupos de ${user.username}`}
											</h1>
										</div>
										<div className="gap-y-12 flex flex-col">
											{ownedGroups.map(
												(i: any, _: number) => (
													<LightGroupCard
														key={_}
														group={i}
													></LightGroupCard>
												)
											)}
										</div>
									</div>
								) : (
									""
								)}
								<div
									className={`flex flex-col gap-y-12 ${
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
							</>
						</TabContent>
					</Tab>
				</Tabs>
			</div>
		</div>
	);
}
