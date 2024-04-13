import { prettyDateTime } from "@/util/prettyDateTime";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { Image, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";
import BookmarkPost from "../post/BookmarkPost";

export default function PostCard({ post }: { post: any }) {
	function truncateString(input: string, maxLength: number): string {
		if (input.length > maxLength) {
			return input.substring(0, maxLength) + "...";
		} else {
			return input;
		}
	}

	const [imageLoaded, setImageLoaded] = useState(false);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {});

	return (
		<div className="w-[1000px] flex">
			{/* Content */}
			<div className="flex flex-col flex-grow">
				<div className="flex justify-between items-center w-full">
					<Link
						className="flex items-center gap-x-2 w-full text-foreground"
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
							<BookmarkPost
								post={post}
								onLoad={() => console.log("not implemented")}
							/>
						</div>
					</div>
				</div>
				<Link
					className="pl-10 relative flex flex-col items-start text-foreground"
					href={`/p/${post.id}`}
				>
					<h2 className="mt-4 break-all	">
						<b>{post.title}</b>
					</h2>
					<p className="mt-2 relative break-all	">
						{truncateString(post.content, 250)}
					</p>
					<div className="under-box-shadow w-full h-[150px] absolute top-0"></div>
				</Link>
			</div>
			{/* Image */}
			{post.media[0] ? (
				<div className="ml-10 w-40 relative shrink-0">
					<Image
						src={post.media[0]}
						className="h-40 w-40 object-cover"
						alt="post-image"
					></Image>
					<div className="absolute bottom-2 right-2 opacity-80 z-50 bg-default-100 rounded-full w-8 h-8 flex items-center justify-center">
						{post.media.length}
					</div>
				</div>
			) : (
				""
			)}
		</div>
	);
}
