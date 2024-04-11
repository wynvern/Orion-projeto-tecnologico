"use client";

import CommentCard from "@/components/Cards/CommentCard";
import ImagePreview from "@/components/modal/ImagePreview";
import { prettyDateTime } from "@/util/prettyDateTime";
import {
	BookmarkIcon,
	ChatBubbleLeftIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import {
	Link,
	Image,
	Input,
	Button,
	ScrollShadow,
	image,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Post({ params }: { params: { id: string } }) {
	const [post, setPost]: any = useState({ id: "" });
	const [commentLoading, setCommentLoading] = useState(false);
	const [imagePos, setImagePost] = useState(0);
	const [previewImages, setPreviewImages] = useState(false);

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

	async function postComment(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setCommentLoading(true);
		const formData = new FormData(e.currentTarget);
		const text: string = formData.get("text") as string;

		console.log(text);
		if (!text || text.length > 300) return false;

		try {
			const response = await fetch(`/api/post/${params.id}/comment`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text }),
			});

			if (!response.ok) {
				const data = await response.json();
				console.error(data);
			}
		} catch (e: any) {
			console.error("Error:", e.message); //mudar
		} finally {
			setCommentLoading(false);
		}
	}

	return (
		<div className="w-full h-full">
			{post.id ? (
				<div className="flex w-full h-full">
					{/* Part for the post stuff */}
					<div
						className={`h-full ${
							post.media.length < 1
								? "w-full p-20"
								: "w-1/2  pl-14 pt-20 pr-14 "
						}`}
					>
						<div className="flex justify-between items-center w-full">
							<Link
								className="flex items-center gap-x-4 w-full text-white"
								href={`/u/${post.author.username}`}
							>
								<Image
									src={post.author.image}
									className="h-10 w-10 rounded-full"
									alt="avatar-user"
								></Image>
								<div>
									<div className="flex gap-x-1">
										<p>
											<b>@{post.author.username}</b>
										</p>
										<p className="text-default-200">•</p>
										<p className="text-default-200">
											{prettyDateTime(post.createdAt)}
										</p>
									</div>
									<div>
										{/* TODO: Go to the group */}
										<p>
											Em <b>Local</b>
										</p>
									</div>
								</div>
							</Link>
							<div>
								<div className="flex items-center gap-x-4">
									<b>0</b>
									<BookmarkIcon className="h-8" />
								</div>
							</div>
						</div>
						<div className="pl-14 relative flex flex-col items-start text-white">
							<h2 className="mt-4">
								<b>{post.title}</b>
							</h2>
							<p className="mt-2 relative">{post.content}</p>
							<div className="under-box-shadow w-full h-[150px] absolute top-0"></div>
						</div>
						<div className="pl-14 pt-6">
							<form
								className="flex gap-x-4"
								onSubmit={postComment}
							>
								{/* TODO: Change to an actual working texarea */}
								<Input
									placeholder="Comentar"
									variant="bordered"
									name="text"
									classNames={{
										inputWrapper: "h-14 border-none",
									}}
									startContent={
										<ChatBubbleLeftIcon className="h-6 mr-1 text-neutral-500" />
									}
									isDisabled={commentLoading}
								></Input>
								<Button
									className="h-14 w-14 text-white flex items-center justify-center border-none"
									type="submit"
									isDisabled={commentLoading}
									variant="bordered"
									isLoading={commentLoading}
								>
									{commentLoading ? (
										""
									) : (
										<PaperAirplaneIcon className="h-6" />
									)}
								</Button>
							</form>
						</div>
						<ScrollShadow className="gap-y-6 pl-14 mt-6 flex flex-col overflow-y-scroll flex-grow">
							{post.comments.map((i: number, _: number) => (
								<CommentCard key={_} comment={i} />
							))}
						</ScrollShadow>
					</div>
					{/* Part for the Image */}
					{post.media.length < 1 ? (
						""
					) : (
						<div className="h-full w-1/2 relative">
							<div className="fixed right-0 h-full flex items-center z-50">
								<div className="pr-10">
									<Link
										className="text-white"
										onClick={() =>
											setImagePost(imagePos + 1)
										}
										isDisabled={
											imagePos == post.media.length - 1
										}
									>
										<ChevronRightIcon className="h-6" />
									</Link>
								</div>
							</div>
							<div className="absolute left-0 h-full flex items-center z-50">
								<div className="pl-10">
									<Link
										isDisabled={imagePos < 1}
										className="text-white"
										onClick={() =>
											setImagePost(imagePos - 1)
										}
									>
										<ChevronLeftIcon className="h-6" />
									</Link>
								</div>
							</div>
							<div className="w-full h-full flex items-center justify-center p-20 relative">
								<Image
									className="max-w-full max-h-full"
									removeWrapper={true}
									src={post.media[imagePos]}
									onClick={() => setPreviewImages(true)}
								></Image>
								<div className="fixed z-50 bottom-8 flex gap-x-2 w-[200px]">
									{post.media.map((i: any, _: number) => (
										<div
											className={`h-2 flex-grow transition-colors duration-300 rounded-full ${
												imagePos == _
													? "bg-white"
													: "bg-default-100"
											}`}
											key={_}
											onClick={() => setImagePost(_)}
											aria-label={i}
										></div>
									))}
								</div>
							</div>
						</div>
					)}
				</div>
			) : (
				""
			)}

			<ImagePreview
				isActive={previewImages}
				setIsActive={setPreviewImages}
				images={post.media}
			/>
		</div>
	);
}
