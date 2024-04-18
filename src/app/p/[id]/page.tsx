"use client";

import CommentCard from "@/components/Cards/CommentCard";
import PostDropdown from "@/components/dropdown/PostDropdown";
import ImagePreview from "@/components/modal/ImagePreview";
import BookmarkPost from "@/components/post/BookmarkPost";
import type Comment from "@/types/Comment";
import type { Post } from "@/types/Post";
import request from "@/util/api";
import getFileBase64 from "@/util/getFile";
import { prettyDateTime } from "@/util/prettyDateTime";
import {
	ChatBubbleLeftIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	PaperAirplaneIcon,
	PhotoIcon,
} from "@heroicons/react/24/outline";
import {
	Link,
	Image,
	Button,
	CircularProgress,
	Chip,
	Textarea,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostView({ params }: { params: { id: string } }) {
	const [post, setPost] = useState<Post | null>(null);
	const [commentLoading, setCommentLoading] = useState(false);
	const [imagePos, setImagePost] = useState(0);
	const [previewImages, setPreviewImages] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [comments, setComments] = useState<Comment[]>([]);
	const router = useRouter();
	const [text, setText] = useState("");
	const [commentImage, setCommentImage] = useState({
		base64: "",
		preview: "",
	});

	async function fetchPost() {
		const data = await request(`/api/post/${params.id}`);
		setPost(data.post);
		setLoaded(true);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchPost();
	}, []); // TODO: Load the posts in the background

	useEffect(() => {
		if (post?.id) {
			fetchComments();
		}
	}, [post?.id]);

	async function fetchComments() {
		const data = await request(`/api/post/${post?.id}/comment`);
		console.log(data.comments);
		setComments(data.comments);
	}

	async function postComment(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setCommentLoading(true);
		if (!text || text.length > 300) return false;

		const data = await request(
			`/api/post/${params.id}/comment`,
			"POST",
			{},
			{ text, image: commentImage.base64 }
		);

		setComments([data.comment, ...comments]);
		setText("");
		setCommentImage({ base64: "", preview: "" });
		setCommentLoading(false);
	}

	async function handleUploadImage() {
		const file = await getFileBase64(["png", "jpeg", "jpg", "gif", "svg"]);
		setCommentImage(file);
	}

	// TODO: Use arrow keys to navigate image
	return (
		<div className="w-full h-full relative overflow">
			<div
				className={`absolute w-full h-full flex items-center justify-center transition-opacity ${
					loaded ? "opacity-0" : ""
				}`}
			>
				<CircularProgress size="lg" />
			</div>
			{post?.id ? (
				<div
					className={`flex w-full h-dvh transition-opacity overflow-y-scroll ${
						loaded ? "opacity-1" : "opacity-0"
					}`}
				>
					{/* Part for the post stuff */}
					<div
						className={`h-full flex flex-col ${
							post.media.length < 1
								? "w-full pt-20 px-60"
								: "w-1/2  pl-14 pt-20 pr-8"
						}`}
					>
						<div className="flex justify-between items-center w-full">
							<div className="flex items-center gap-x-4 w-full text-foreground">
								<Link href={`/u/${post.author.username}`}>
									<Image
										src={
											post.author.image ||
											"/brand/default-user.svg"
										}
										className="h-12 w-12 rounded-full"
										alt="avatar-user"
									/>
								</Link>
								<div className="flex gap-y-2 flex-col">
									<div className="flex gap-x-1">
										<Link
											href={`/u/${post.author.username}`}
											className="text-foreground"
										>
											<p>
												<b>{post.author.username}</b>
											</p>
										</Link>
										<p className="text-foreground">•</p>
										<p className="text-foreground">
											{prettyDateTime(post.createdAt)}
										</p>
									</div>
									<div className="flex gap-x-2">
										<Link href={`/g/${post.group.name}`}>
											<Chip
												className="pl-[2px] flex justify-center"
												startContent={
													<Image
														src={
															post.group.logo ||
															"/brand/default-group.svg"
														}
														removeWrapper={true}
														className="h-6 w-6 object-cover mr-[2px]"
													/>
												}
											>
												{post.group.name}
											</Chip>
										</Link>
									</div>
								</div>
							</div>
							<div>
								<div className="flex items-center gap-x-4">
									<BookmarkPost post={post} />
									<PostDropdown
										post={post}
										onDelete={() => router.back()}
									/>
								</div>
							</div>
						</div>
						<div className="pl-16 relative flex flex-col items-start text-foreground">
							<h2 className="mt-4 break-all	">
								<b>{post.title}</b>
							</h2>
							<p className="mt-2 relative break-all	">
								{post.content}
							</p>
						</div>
						<div className="pl-16 pt-6">
							<form
								className="flex gap-x-4 bg-default-100 rounded-large p-4"
								onSubmit={postComment}
							>
								<div className="flex flex-col grow">
									<Textarea
										placeholder="Comentar"
										variant="bordered"
										name="text"
										max={200}
										classNames={{
											inputWrapper: "h-14 border-none",
										}}
										startContent={
											<ChatBubbleLeftIcon className="h-6 mr-1 text-neutral-500" />
										}
										isDisabled={commentLoading}
										value={text}
										onValueChange={(e) => setText(e)}
									/>
									<div className="ml-10 mt-4">
										<Image
											src={commentImage.preview}
											className="max-h-[200px] max-w-[200px]"
										/>
									</div>
								</div>
								<Button
									variant="bordered"
									className="border-none"
									isIconOnly={true}
									onClick={() => handleUploadImage()}
								>
									<PhotoIcon className="h-6" />
								</Button>
								<Button
									className="text-foreground flex items-center justify-center p-2 text-white"
									type="submit"
									color="primary"
									isDisabled={commentLoading || !text}
									isIconOnly={true}
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
						<div className="gap-y-8 pl-16 mt-6 flex flex-col">
							{comments.map((i: Comment, _: number) => (
								<CommentCard
									key={i.id}
									comment={i}
									isLast={_ === comments.length - 1}
								/>
							))}
						</div>
					</div>
					{/* Part for the Image */}
					{post.media.length < 1 ? (
						""
					) : (
						<div className="h-full w-1/2 relative">
							<div className="fixed right-0 h-full flex items-center z-50">
								<div className="pr-10">
									<Link
										className="text-foreground bg-background"
										onClick={() =>
											setImagePost(imagePos + 1)
										}
										isDisabled={
											imagePos === post.media.length - 1
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
										className="text-foreground"
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
								/>
								<div className="fixed z-50 bottom-8 flex gap-x-2 w-[200px]">
									{post.media.map((i: string, _: number) => (
										<div
											className={`h-2 flex-grow transition-colors duration-300 rounded-full bg-foreground ${
												imagePos === _
													? "opacity-1"
													: "opacity-[50%]"
											}`}
											key={i}
											onClick={() => setImagePost(_)}
											aria-label={i}
											onKeyUp={(event) => {
												if (event.key === "ArrowLeft") {
													setImagePost(imagePos - 1);
												}
											}}
										/>
									))}
								</div>
							</div>
						</div>
					)}
				</div>
			) : (
				""
			)}

			{post ? (
				<ImagePreview
					isActive={previewImages}
					setIsActive={setPreviewImages}
					images={post.media}
					startIndex={imagePos}
				/>
			) : (
				""
			)}
		</div>
	);
}
