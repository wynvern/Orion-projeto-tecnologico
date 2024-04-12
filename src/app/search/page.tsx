"use client";

import LightGroupCard from "@/components/Cards/Light/LightGroupCard";
import PostCard from "@/components/Cards/PostCard";
import request from "@/util/api";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button, Input, Tab, Tabs } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Search() {
	const [inputErrors, setInputErrors] = useState({ search: "" });
	const [selected, setSelected] = useState(0);
	const [retrievedPosts, setRetrievedPosts] = useState([]);
	const [retrievedGroups, setRetrievedGroups] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	async function fetchPosts(search: string) {
		const data = await request(`/api/search/post?search=${search}`);
		setRetrievedPosts(data.posts);
	}

	async function fetchGroups(search: string) {
		const data = await request(`/api/search/group?search=${search}`);
		setRetrievedGroups(data.groups);
	}

	async function handleFetch(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		handleFetchType();
	}

	async function handleFetchType() {
		if (!searchTerm) return false;

		if (selected == 0) {
			fetchPosts(searchTerm);
		} else if (selected == 2) {
			fetchGroups(searchTerm);
		}
	}

	useEffect(() => {
		handleFetchType();
	}, [selected, searchTerm]);

	// TODO: not update when typed because its too heavy on the server
	return (
		<div className="w-full h-full relative overflow-y-scroll">
			<div className="h-full w-full flex items-center flex-col">
				<div className="w-full h-full mt-[calc(50vh-70px)] w-[750px] flex items-center flex-col h-[120px] bg-default-100 rounded-large">
					<form
						onSubmit={handleFetch}
						className="w-full h-full flex items-center p-8"
					>
						<Input
							variant="bordered"
							type="text"
							placeholder="Título do Grupo"
							name="search"
							classNames={{ inputWrapper: "h-14" }}
							startContent={
								<MagnifyingGlassIcon className="h-6 text-neutral-500" />
							}
							isInvalid={Boolean(inputErrors.search)}
							errorMessage={inputErrors.search}
							onValueChange={(e: any) => {
								setSearchTerm(e);
								setInputErrors({ ...inputErrors, search: "" });
							}}
							value={searchTerm}
						/>
						<input type="submit" className="hidden" />
					</form>
				</div>
				<Tabs
					className="mt-14"
					classNames={{ tabList: "w-[500px] h-14", tab: "h-10" }}
					variant="light"
					color="primary"
					onSelectionChange={(e: any) => setSelected(e.split(".")[1])}
				>
					<Tab title={<h3>Posts</h3>}>
						<div className="w-full gap-y-12 flex flex-col pt-10">
							{retrievedPosts.map((i: any, _: number) => (
								<PostCard post={i} key={_} />
							))}
						</div>
					</Tab>
					<Tab title={<h3>Usuário</h3>}>HELO</Tab>
					<Tab title={<h3>Grupos</h3>}>
						<div className="w-full gap-y-12 flex flex-col pt-10">
							{retrievedGroups.map((i: any, _: number) => (
								<LightGroupCard group={i} key={_} />
							))}
						</div>
					</Tab>
				</Tabs>
			</div>
		</div>
	);
}
