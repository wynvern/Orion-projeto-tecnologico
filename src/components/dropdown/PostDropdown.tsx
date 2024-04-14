import request from "@/util/api";
import {
	SunIcon,
	MoonIcon,
	UserIcon,
	InformationCircleIcon,
	ArrowLeftEndOnRectangleIcon,
	EllipsisHorizontalIcon,
	TrashIcon,
	ShareIcon,
} from "@heroicons/react/24/outline";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/react";
import ConfirmationModal from "../modal/ConfirmClose";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function PostDropdown({
	post,
	onDelete,
}: {
	post: any;
	onDelete: any;
}) {
	const session = useSession();

	async function deltePost() {
		const data = await request(`/api/post/${post.id}`, "DELETE");
		onDelete();
	}

	const [confirmModal, setConfirmModal] = useState(false);
	const isAuthor = session.data?.user.id === post.authorId;

	return (
		<>
			<Dropdown placement="bottom-end" className="text-foreground">
				<DropdownTrigger>
					<Button
						isIconOnly={true}
						variant="bordered"
						className="border-none"
						aria-label="Post Configuration"
					>
						<EllipsisHorizontalIcon className="h-10" />
					</Button>
				</DropdownTrigger>
				<DropdownMenu
					aria-labelledby="post-configuration"
					variant="flat"
				>
					<DropdownItem
						onClick={() =>
							navigator.clipboard.writeText(window.location.href)
						}
						key="share-post"
						className="h-10 gap-2 border-radius-sys pl-3"
						description="Compartilhe este post"
						startContent={<ShareIcon className="h-8" />}
						aria-label="Share Post"
					>
						<p className="">Compartilhar</p>
					</DropdownItem>
					{isAuthor ? (
						<DropdownItem
							onClick={() => setConfirmModal(true)}
							color="danger"
							key="delete-post"
							className="h-10 gap-2 border-radius-sys pl-3"
							description="Delete este post e todo o seu conteúdo."
							startContent={
								<TrashIcon className="h-8 text-danger" />
							}
							aria-label="Delete Post"
						>
							<p className="text-danger">Deletar post</p>
						</DropdownItem>
					) : (
						<DropdownItem className="hidden"></DropdownItem>
					)}
				</DropdownMenu>
			</Dropdown>

			<ConfirmationModal
				title="Excluír post"
				message="Deseja realmente excluír este post? Esta ação não pode ser revertida."
				isOpen={confirmModal}
				onConfirm={() => {
					deltePost();
					setConfirmModal(false);
				}}
				onClose={() => setConfirmModal(false)}
				aria-label="Confirmation Modal"
			/>
		</>
	);
}
