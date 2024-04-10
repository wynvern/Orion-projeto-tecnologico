"use client";

import { prettyDateTime } from "@/util/prettyDateTime";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { Link, Image } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Post({ params }: { params: { id: string } }) {
	const [post, setPost]: any = useState({ id: "" });

	async function fetchPost() {
		try {
			const response = await fetch(`/api/post/${params.id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				const data = await response.json();
				setPost(data.post);
			}
		} catch (e: any) {
			console.error("Error:", e.message); //mudar
		}
	}

	useEffect(() => {
		fetchPost();
	}, []);

	return (
		<div className="w-full h-full">
			{post.id ? (
				<div className="flex w-full h-full">
					{/* Part for the post stuff */}
					<div className="w-1/2 h-full p-20">
						<div className="flex justify-between items-center w-full">
							<Link
								className="flex items-center gap-x-2 w-full text-white"
								href={`/u/${post.author.username}`}
							>
								<Image
									src={post.author.image}
									className="h-8 w-8 rounded-full"
									alt="avatar-user"
								></Image>
								<div className="flex gap-x-1">
									<p>
										<b>@{post.author.username}</b>
									</p>
									<p className="text-default-200">•</p>
									<p className="text-default-200">
										{prettyDateTime(post.createdAt)}
									</p>
								</div>
							</Link>
							<div>
								<div className="flex items-center gap-x-4">
									<b>0</b>
									<BookmarkIcon className="h-8" />
								</div>
							</div>
						</div>
						<Link
							className="pl-10 relative flex flex-col items-start text-white"
							href={`/p/${post.id}`}
						>
							<h2 className="mt-4">
								<b>{post.title}</b>
							</h2>
							<p className="mt-2 relative">{post.content}</p>
							<div className="under-box-shadow w-full h-[150px] absolute top-0"></div>
						</Link>
					</div>
					{/* Part for the Image */}
					<div className="h-full w-1/2 bg-default-100"></div>
				</div>
			) : (
				""
			)}
		</div>
	);
}
