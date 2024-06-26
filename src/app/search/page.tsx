"use client";

import LightGroupCard from "@/components/Cards/Light/LightGroupCard";
import LightUserCard from "@/components/Cards/Light/LightUserCard";
import PostCard from "@/components/Cards/PostCard";
import type { Group } from "@/types/Group";
import type { Post } from "@/types/Post";
import type User from "@/types/User";
import request from "@/util/api";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { CircularProgress, Input, Tab, Tabs } from "@nextui-org/react";
import { type Key, useEffect, useRef, useState } from "react";

export default function Search() {
	const [selected, setSelected] = useState(0);
	const [retrievedPosts, setRetrievedPosts] = useState([]);
	const [retrievedGroups, setRetrievedGroups] = useState([]);
	const [retrievedUsers, setRetrievedUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [skipped, setSkipped] = useState(0);
	const [noResults, setNoResults] = useState(false);
	const [retreiving, setRetreiving] = useState(false);

	const loadingRef = useRef(null);

	async function fetchGroups(search: string) {
		const data = await request(
			`/api/search/group?search=${search}&skip=${skipped}`
		);
		setRetrievedGroups(retrievedGroups.concat(data.groups)); // Adding more to load
		if (data.groups.length < 1) setNoResults(true);
	}

	async function fetchUser(search: string) {
		const data = await request(
			`/api/search/user?search=${search}&skip=${skipped}`
		);
		setRetrievedUsers(retrievedUsers.concat(data.users));
		if (data.users.length < 1) setNoResults(true);
	}

	function clearSearch() {
		setRetrievedGroups([]);
		setRetrievedPosts([]);
		setRetrievedUsers([]);
		setSkipped(0);
	}

	async function handleFetchType() {
		if (!searchTerm) {
			clearSearch();
			return false;
		}

		if (selected === 0) {
			fetchPosts(searchTerm);
		} else if (selected === 2) {
			fetchGroups(searchTerm);
		} else if (selected === 1) {
			fetchUser(searchTerm);
		}
		setSkipped(skipped + 10);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		handleFetchType();
	}, [selected]);

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		if (e?.target && e.target instanceof HTMLElement) {
			const bottom =
				Math.ceil(e.target.scrollTop) + e.target.clientHeight >=
				e.target.scrollHeight;
			if (bottom) {
				handleFetchType();
			}
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const timer = setTimeout(() => {
			handleFetchType();
		}, 500); // Adjust the delay as needed

		return () => clearTimeout(timer);
	}, [searchTerm]);

	async function fetchPosts(search: string) {
		setRetreiving(true);
		const data = await request(
			`/api/search/post?search=${search}&skip=${skipped}`
		);
		setRetrievedPosts(retrievedPosts.concat(data.posts));
		if (data.posts.length < 1) setNoResults(true);
		setRetreiving(false);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const options = {
			root: null,
			rootMargin: "0px",
			threshold: 1.0,
		};

		const observer = new IntersectionObserver((entries) => {
			const target = entries[0];
			if (target.isIntersecting) {
				handleFetchType();
			}
		}, options);

		if (loadingRef.current) {
			observer.observe(loadingRef.current);
		}

		return () => {
			if (loadingRef.current) {
				observer.unobserve(loadingRef.current);
			}
		};
	}, [loadingRef]);

	return (
		<div
			className="w-full h-full relative overflow-y-scroll"
			onScroll={handleScroll}
		>
			<div className="h-full w-full flex items-center flex-col h-fit">
				<div
					className={`w-full h-fit flex items-center flex-col rounded-large transition-all ${
						searchTerm === "" ? "mt-[calc(50vh-100px)]" : "mt-10"
					}`}
				>
					<h1>Pesquisa</h1>
					<div className="w-[750px] h-fit flex items-center p-8">
						<Input
							type="text"
							placeholder="Digite algo para pesquisar..."
							name="search"
							classNames={{ inputWrapper: "h-14" }}
							startContent={
								<MagnifyingGlassIcon className="h-6 text-neutral-500" />
							}
							onValueChange={(e: string) => {
								setSearchTerm(e);
								clearSearch();
								setNoResults(false);
							}}
							value={searchTerm}
							autoFocus={true}
						/>
					</div>
				</div>
				<Tabs
					className="mt-1"
					classNames={{ tabList: "w-[500px] h-14", tab: "h-10" }}
					variant="light"
					color="primary"
					onSelectionChange={(e: Key) => {
						setSelected(Number(e.toString().split(".")[1]));
						clearSearch();
						setNoResults(false);
					}}
				>
					<Tab title={<h3>Posts</h3>}>
						<div className="w-full gap-y-12 flex flex-col pt-10">
							{retrievedPosts.map((i: Post) => (
								<PostCard
									post={i}
									key={i.id}
									update={() => fetchPosts(searchTerm)}
								/>
							))}
						</div>
						<div
							className={`flex flex-col my-20 text-neutral-800 w-[1000px] items-center ${
								noResults ? "" : "hidden"
							}`}
						>
							<h2>Sem resultados</h2>
						</div>
						<div
							className={`my-10 w-[1000px] flex items-center justify-center ${
								retreiving ? "opacity-1" : "opacity-0"
							}`}
						>
							<CircularProgress size="lg" />
						</div>
						<div ref={loadingRef} />
					</Tab>
					<Tab title={<h3>Usuários</h3>}>
						<div className="w-full gap-y-12 flex flex-col pt-10">
							{retrievedUsers.map((i: User) => (
								<LightUserCard user={i} key={i.id} />
							))}
						</div>
						<div
							className={`flex flex-col my-20 text-neutral-800 w-[750px] items-center ${
								noResults ? "" : "hidden"
							}`}
						>
							<h2>Sem mais resultados</h2>
						</div>
						<div ref={loadingRef} />
					</Tab>
					<Tab title={<h3>Grupos</h3>}>
						<div className="w-full gap-y-12 flex flex-col pt-10">
							{retrievedGroups.map((i: Group) => (
								<LightGroupCard group={i} key={i.id} />
							))}
						</div>
						<div
							className={`flex flex-col my-20 text-neutral-800 w-[750px] items-center ${
								noResults ? "" : "hidden"
							}`}
						>
							<h2>Sem mais resultados</h2>
						</div>
						<div ref={loadingRef} />
					</Tab>
				</Tabs>
			</div>
		</div>
	);
}
