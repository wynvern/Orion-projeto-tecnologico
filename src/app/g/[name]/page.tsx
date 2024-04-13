"use client";

import GroupCard from "@/components/Cards/GroupCard";
import PostCard from "@/components/Cards/PostCard";
import CreatePost from "@/components/modal/CreatePost";
import CustomizeGroup from "@/components/modal/CustomizeGroup";
import request from "@/util/api";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function GroupPage({ params }: { params: { name: string } }) {
	const [group, setGroup] = useState({
		groupname: "",
		name: "",
		image: "",
		description: "",
		banner: "",
		id: "",
		ownerId: "",
		_count: { members: 0, posts: 0 },
		categories: [],
	});
	const session = useSession();
	const [createPostModal, setCreatePostModal] = useState(false);
	const [posts, setPosts]: any[] = useState([]);
	const [isIn, setIsIn] = useState(false);

	async function viewGroup() {
		if (group.id) {
			try {
				await fetch(`/api/group/${group.id}/view`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
				});
			} catch (e) {
				console.error(e);
			}
		}
	}

	async function fetchGroup() {
		const data = await request(`/api/query/group?name=${params.name}`); // TODO: Show message that group could not be found
		const updateGroup = data.group;
		setGroup({
			...updateGroup,
			image: updateGroup.image
				? updateGroup + `?timestamp=${new Date().getTime()}`
				: updateGroup.image,
			banner: updateGroup.banner
				? updateGroup.banner + `?timestamp=${new Date().getTime()}`
				: updateGroup.banner,
		});
	}

	async function fetchIsIn() {
		if (group.id) {
			const data = await request(`/api/group/${group.id}/in`);

			console.log(data);
			setIsIn(data.message == "following" ? true : false);
		}
	}

	useEffect(() => {
		fetchGroup();
	}, []);

	useEffect(() => {
		viewGroup();
	}, [group]);

	useEffect(() => {
		fetchPosts();
		fetchIsIn();
	}, [group.id]);

	async function fetchPosts() {
		try {
			const response = await fetch(`/api/group/${group.id}/post`);

			if (response.ok) {
				const data = await response.json();
				setPosts(data.posts);
			}
		} catch (e) {
			console.error(e);
		}
	}

	// TODO: Button to scroll to the top of the page on top of create button
	return (
		<div className="w-full h-full">
			<div className="w-full h-full flex items-center flex-col overflow-y-scroll">
				<div className="flex items-center justify-center h-[400px] w-[1000px] mt-[calc(50vh-200px)]">
					<div className="content-container">
						<GroupCard group={group} update={() => fetchGroup()} />
					</div>
				</div>
				<div className="flex flex-col gap-y-12 mt-20">
					{posts.map((i: any, _: number) => (
						<PostCard key={_} post={i} />
					))}
				</div>
			</div>

			{isIn || session.data?.user.id == group.ownerId ? (
				<>
					<div className="fixed z-50 bottom-0 right-0 pr-12 pb-12">
						<Button
							size="lg"
							color="primary"
							isIconOnly={true}
							className="w-14 h-14"
							onClick={() => setCreatePostModal(!createPostModal)}
						>
							<PlusIcon className="h-6 w-6" />
						</Button>
					</div>
					<CreatePost
						update={() => fetchPosts()}
						isActive={createPostModal}
						setIsActive={setCreatePostModal}
						group={group}
					/>{" "}
				</>
			) : (
				""
			)}
		</div>
	);
}
