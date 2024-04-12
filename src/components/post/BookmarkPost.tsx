import request from "@/util/api";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/outline";
import { BookmarkIcon } from "@heroicons/react/24/solid";
import { Button, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function BookmarkPost({
	post,
	onLoad,
}: {
	post: any;
	onLoad?: () => void;
}) {
	const [isBookmarked, setIsBookmarked] = useState(false);

	useEffect(() => {
		const fetchPostStatus = async () => {
			const data = await request(`/api/post/${post.id}/bookmark`);
			setIsBookmarked(data.message === "bookmarked");
			if (onLoad) onLoad();
		};

		fetchPostStatus();
	}, [post.id]);

	const handleButtonClick = async () => {
		try {
			const method = isBookmarked ? "DELETE" : "POST";
			await fetch(`/api/post/${post.id}/bookmark`, { method });
			setIsBookmarked(!isBookmarked);
		} catch (error) {
			console.error("Error updating post status:", error);
		}
	};

	return (
		<Button
			isIconOnly={true}
			className="h-14 w-14 border-none"
			size="lg"
			variant="bordered"
			onClick={handleButtonClick}
		>
			{isBookmarked ? (
				<BookmarkIcon className="h-8" />
			) : (
				<BookmarkIconSolid className="h-8" />
			)}
		</Button>
	);
}
