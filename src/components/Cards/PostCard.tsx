import { prettyDateTime } from "@/util/prettyDateTime";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { Image, Link } from "@nextui-org/react";

export default function PostCard({ post }: { post: any }) {
	function truncateString(input: string, maxLength: number): string {
		if (input.length > maxLength) {
			return input.substring(0, maxLength) + "...";
		} else {
			return input;
		}
	}

	return (
		<div className="w-[1000px] flex">
			{/* Content */}
			<div className="flex flex-col flex-grow">
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
					<p className="mt-2 relative">
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
				<div className="w-40 ml-10 shrink-0"></div>
			)}
		</div>
	);
}