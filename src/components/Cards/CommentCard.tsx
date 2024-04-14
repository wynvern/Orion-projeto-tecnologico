import request from "@/util/api";
import { prettyDateTime } from "@/util/prettyDateTime";
import {
	ChatBubbleBottomCenterIcon,
	ChatBubbleLeftIcon,
	EllipsisHorizontalIcon,
	MinusCircleIcon,
	PaperAirplaneIcon,
	PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { Button, Image, Link, Textarea } from "@nextui-org/react";
import { useState } from "react";
import { text } from "stream/consumers";

export default function CommentCard({
	comment,
	isLast,
}: {
	comment: any;
	isLast: boolean;
}) {
	const [text, setText] = useState("");
	const [commentLoading, setCommentLoading] = useState(false);
	const [commentVisible, setCommentVisible] = useState(false);
	const [comments, setComments]: any = useState(comment.childComments || []);
	const [hideComments, setHideComments] = useState(false);

	function truncateString(input: string, maxLength: number): string {
		if (input.length > maxLength) {
			return input.substring(0, maxLength) + "...";
		} else {
			return input;
		}
	}

	async function postComment(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log("Post comment:", text);

		const data = await request(
			`/api/comment/${comment.id}`,
			"POST",
			{},
			{ text }
		);
		setComments([...comments, data.comment]);
		setCommentVisible(false);
	}

	return (
		<div className=" flex">
			{/* Content */}
			<div className="flex flex-col flex-grow relative">
				<div
					className={`absolute bottom-0 left-4 ml-[1.5px] w-[2px] bg-default-100 h-full ${
						comments.length < 1 || hideComments ? "opacity-0" : ""
					}`}
				></div>
				{comments.length > 0 && isLast && (
					<div className="absolute w-10 h-full bg-black -left-12 top-10" />
				)}
				<Button
					className={`absolute border-none z-50 -left-14 ml-[7px] rounded-full bg-background ${
						comments.length < 1 ? "hidden" : ""
					}`}
					isIconOnly={true}
					onClick={() => setHideComments(!hideComments)}
					variant="bordered"
				>
					{hideComments ? (
						<MinusCircleIcon className="h-6" />
					) : (
						<PlusCircleIcon className="h-6" />
					)}
				</Button>
				<div className="flex justify-between items-center w-full">
					<Link
						className="flex items-center gap-x-2 w-full text-foreground"
						href={`/u/${comment.author.username}`}
					>
						<Image
							src={
								comment.author.image ||
								"/brand/default-user.svg"
							}
							className="h-10 w-10 rounded-full"
							alt="avatar-user"
						></Image>
						<div className="flex gap-x-1">
							<p>
								<b>@{comment.author.username}</b>
							</p>
							<p className="text-foreground">•</p>
							<p className="text-foreground">
								{prettyDateTime(comment.createdAt)}
							</p>
						</div>
					</Link>
					<div>
						<div className="flex items-center gap-x-4">
							<Button
								className="border-none"
								variant="bordered"
								onClick={() =>
									setCommentVisible(!commentVisible)
								}
							>
								<ChatBubbleBottomCenterIcon className="h-6" />
							</Button>
							<EllipsisHorizontalIcon className="h-8" />
						</div>
					</div>
				</div>
				<Link className="pl-12 relative flex flex-col items-start text-foreground">
					<p className="mt-2 relative break-all	">{comment.text}</p>
					<div className="under-box-shadow w-full  absolute top-0"></div>
				</Link>
				<div className="ml-12">
					{/* Replies */}
					<div className={`mt-6 ${commentVisible ? "" : "hidden"}`}>
						<form
							className="flex gap-x-4 bg-default-100 rounded-large p-4"
							onSubmit={postComment}
						>
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
							<Button
								className="text-foreground flex items-center justify-center p-2 text-white"
								type="submit"
								color="primary"
								isDisabled={commentLoading}
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

					<div className={`${hideComments ? "hidden" : ""}`}>
						{/* Child comments */}
						{comments && comments.length > 0 && (
							<div className=" mt-6 flex flex-col gap-y-8">
								{comments.map(
									(childComment: any, index: number) => (
										<CommentCard
											key={childComment.id}
											comment={childComment}
											isLast={
												index === comments.length - 1
											}
										/>
									)
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
