"use client";

import GroupCard from "@/components/Cards/GroupCard";
import CreatePost from "@/components/modal/CreatePost";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function GroupPage({ params }: { params: { name: string } }) {
	const [group, setGroup] = useState({
		groupname: "",
		name: "",
		image: "",
		description: "",
		banner: "",
		id: "",
	});
	const [createPostModal, setCreatePostModal] = useState(false);

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
		try {
			const response = await fetch(
				`/api/query/group?name=${params.name}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (response.ok) {
				const data = await response.json(); // TODO: Show message that group could not be found
				console.log(data);
				setGroup(data.groups[0]);
			}
		} catch (e: any) {
			console.error("Error:", e.message); //mudar
		}
	}

	useEffect(() => {
		fetchGroup();
	}, []);

	useEffect(() => {
		viewGroup();
	}, [group]);

	const [loaded, setLoaded] = useState(false);

	// TODO: Button to scroll to the top of the page on top of create button
	return (
		<div className="w-full h-full">
			<style jsx>{`
				.loader-container {
					opacity: ${loaded ? 0 : 1};
					transition: opacity 0.2s ease-in-out;
				}

				.content-container {
					opacity: ${loaded ? 1 : 0};
					transition: opacity 0.2s ease-in-out;
				}
			`}</style>

			<div className="w-full h-full flex items-center justify-center">
				{group.id ? (
					<div className="content-container">
						<GroupCard
							group={group}
							onLoad={() => setLoaded(true)}
						/>
					</div>
				) : (
					""
				)}
				<div className="loader-container fixed">
					<Spinner />
				</div>
			</div>
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
				isActive={createPostModal}
				setIsActive={setCreatePostModal}
				group={group}
			/>
		</div>
	);
}
