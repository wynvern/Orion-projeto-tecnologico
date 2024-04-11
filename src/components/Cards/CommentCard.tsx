import { prettyDateTime } from "@/util/prettyDateTime";
import {
	BookmarkIcon,
	EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { Image, Link } from "@nextui-org/react";

export default function CommentCard({ comment }: { comment: any }) {
	function truncateString(input: string, maxLength: number): string {
		if (input.length > maxLength) {
			return input.substring(0, maxLength) + "...";
		} else {
			return input;
		}
	}

	return (
		<div className=" flex">
			{/* Content */}
			<div className="flex flex-col flex-grow">
				<div className="flex justify-between items-center w-full">
					<Link
						className="flex items-center gap-x-2 w-full text-white"
						href={`/u/${comment.author.username}`}
					>
						<Image
							src={comment.author.image}
							className="h-8 w-8 rounded-full"
							alt="avatar-user"
						></Image>
						<div className="flex gap-x-1">
							<p>
								<b>@{comment.author.username}</b>
							</p>
							<p className="text-default-200">•</p>
							<p className="text-default-200">
								{prettyDateTime(comment.createdAt)}
							</p>
						</div>
					</Link>
					<div>
						<div className="flex items-center gap-x-4">
							<EllipsisHorizontalIcon className="h-8" />
						</div>
					</div>
				</div>
				<Link
					className="pl-10 relative flex flex-col items-start text-white"
					href={`/p/${comment.id}`}
				>
					<p className="mt-2 relative">
						{truncateString(comment.text, 250)}
					</p>
					<div className="under-box-shadow w-full  absolute top-0"></div>
				</Link>
			</div>
		</div>
	);
}
