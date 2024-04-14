"use client";

import GroupCard from "@/components/Cards/GroupCard";
import PostCard from "@/components/Cards/PostCard";
import CreatePost from "@/components/modal/CreatePost";
import request from "@/util/api";
import {
	BarsArrowDownIcon,
	FunnelIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";
import {
	Button,
	CircularProgress,
	Select,
	SelectItem,
} from "@nextui-org/react";
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
	const [skip, setSkip] = useState(0);
	const [loading, setLoading] = useState(true);
	const [sortingType, setSortingType] = useState(new Set(["createdAt"]));

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
				? updateGroup.image + `?timestamp=${new Date().getTime()}`
				: undefined,
			banner: updateGroup.banner
				? updateGroup.banner + `?timestamp=${new Date().getTime()}`
				: undefined,
		});
	}

	async function fetchIsIn() {
		if (group.id) {
			const data = await request(`/api/group/${group.id}/in`);
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
		if (group.id) {
			fetchPosts();
			fetchIsIn();
		}
	}, [group.id]);

	async function fetchPosts() {
		setLoading(true);
		const data = await request(
			`/api/group/${group.id}/post?skip=${skip}&sortBy=${
				Array.from(sortingType)[0]
			}`,
			"GET"
		);
		setPosts(posts.concat(data.posts));
		setSkip(skip + 10);
		setLoading(false);
	}

	const handleScroll = (e: any) => {
		const bottom =
			Math.ceil(e.target.scrollTop) + e.target.clientHeight >=
			e.target.scrollHeight;
		if (bottom) {
			fetchPosts();
		}
	};

	useEffect(() => {
		if (group.id) {
			setSkip(0);
			setPosts([]);
			fetchPosts();
		}
	}, [sortingType]);

	// TODO: Button to scroll to the top of the page on top of create button
	return (
		<div className="w-full h-full">
			<div
				className="w-full h-full flex items-center flex-col overflow-y-scroll"
				onScroll={handleScroll}
			>
				<div className="flex items-center justify-center h-[400px] w-[1000px] mt-[calc(50vh-200px)]">
					<div className="content-container">
						<GroupCard
							group={group}
							update={() => fetchGroup()}
							aria-label="Group Card"
						/>
					</div>
				</div>
				<div className="my-14">
					<div
						className={`w-[1000px] ${
							loading ? "hidden" : "visible"
						}`}
					>
						<Select
							selectedKeys={sortingType}
							onSelectionChange={(e: any) => {
								if (e.size == 1) setSortingType(e);
							}}
							placeholder="Select sorting type"
							variant="bordered"
							className="border-none w-[200px]"
							startContent={
								<BarsArrowDownIcon className="h-6 w-6" />
							}
							aria-label="Sorting Select"
						>
							<SelectItem key={"createdAt"} value="createdAt">
								Mais recentes
							</SelectItem>
							<SelectItem
								key={"createdAt_asc"}
								value="createdAt_asc"
							>
								Mais antigos
							</SelectItem>
						</Select>
					</div>
				</div>
				<div className="flex flex-col gap-y-12">
					{posts.map((i: any, _: number) => (
						<PostCard
							key={_}
							post={i}
							update={() => fetchPosts()}
							aria-label="Post Card"
						/>
					))}
				</div>
				<div className={loading ? "visible" : "hidden"}>
					<CircularProgress size="lg" aria-label="Loading" />
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
							aria-label="Create Post Button"
							aria-labelledby="create-post-button"
						>
							<PlusIcon className="h-6 w-6" />
						</Button>
					</div>
					<CreatePost
						update={() => fetchPosts()}
						isActive={createPostModal}
						setIsActive={setCreatePostModal}
						group={group}
						aria-label="Create Post Modal"
					/>{" "}
				</>
			) : (
				""
			)}
		</div>
	);
}
