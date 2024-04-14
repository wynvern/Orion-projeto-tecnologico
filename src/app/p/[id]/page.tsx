"use client";

import CommentCard from "@/components/Cards/CommentCard";
import PostDropdown from "@/components/dropdown/PostDropdown";
import ImagePreview from "@/components/modal/ImagePreview";
import BookmarkPost from "@/components/post/BookmarkPost";
import request from "@/util/api";
import { prettyDateTime } from "@/util/prettyDateTime";
import {
	BookmarkIcon,
	ChatBubbleLeftIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	EllipsisHorizontalIcon,
	PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import {
	Link,
	Image,
	Input,
	Button,
	ScrollShadow,
	image,
	CircularProgress,
	Chip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Post({ params }: { params: { id: string } }) {
	const [post, setPost]: any = useState({ id: "" });
	const [commentLoading, setCommentLoading] = useState(false);
	const [imagePos, setImagePost] = useState(0);
	const [previewImages, setPreviewImages] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [comments, setComments] = useState([]);
	const router = useRouter();
	const [text, setText] = useState("");

	async function fetchPost() {
		const data = await request(`/api/post/${params.id}`);
		setPost(data.post);
		setLoaded(true);
	}

	useEffect(() => {
		fetchPost();
	}, []);

	useEffect(() => {
		if (post.id) {
			fetchComments();
		}
	}, [post.id]);

	async function fetchComments() {
		const data = await request(`/api/post/${post.id}/comment`);
		setComments(data.comments);
	}

	async function postComment(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setCommentLoading(true);
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
			} else {
				fetchComments();
				setText("");
			}
		} catch (e: any) {
			console.error("Error:", e.message); //mudar
		} finally {
			setCommentLoading(false);
		}
	}

	// TODO: Use arrow keys to navigate image
	return (
		<div className="w-full h-full relative">
			<div
				className={`absolute w-full h-full flex items-center justify-center transition-opacity ${
					loaded ? "opacity-0" : ""
				}`}
			>
				<CircularProgress size="lg"></CircularProgress>
			</div>
			{post.id ? (
				<div
					className={`flex w-full h-full transition-opacity ${
						loaded ? "opacity-1" : "opacity-0"
					}`}
				>
					{/* Part for the post stuff */}
					<div
						className={`h-full flex flex-col ${
							post.media.length < 1
								? "w-full pt-20 px-20"
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
									></Image>
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
							<div className="under-box-shadow w-full h-[150px] absolute top-0"></div>
						</div>
						<div className="pl-16 pt-6">
							<form
								className="flex gap-x-4"
								onSubmit={postComment}
							>
								{/* TODO: Change to an actual working texarea */}
								<Input
									placeholder="Comentar"
									variant="bordered"
									name="text"
									maxLength={200}
									classNames={{
										inputWrapper: "h-14 border-none",
									}}
									startContent={
										<ChatBubbleLeftIcon className="h-6 mr-1 text-neutral-500" />
									}
									isDisabled={commentLoading}
									value={text}
									onValueChange={(e) => setText(e)}
								></Input>
								<Button
									className="h-14 w-14 text-foreground flex items-center justify-center border-none"
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
						<ScrollShadow className="gap-y-6 pl-16 mt-6 flex flex-col overflow-y-scroll grow">
							{comments.map((i: number, _: number) => (
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
										className="text-foreground bg-background"
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
								></Image>
								<div className="fixed z-50 bottom-8 flex gap-x-2 w-[200px]">
									{post.media.map((i: any, _: number) => (
										<div
											className={`h-2 flex-grow transition-colors duration-300 rounded-full bg-foreground ${
												imagePos == _
													? "opacity-1"
													: "opacity-[50%]"
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
				startIndex={imagePos}
			/>
		</div>
	);
}
