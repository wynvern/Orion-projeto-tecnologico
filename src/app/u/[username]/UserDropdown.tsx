import type User from "@/types/User";
import {
	EllipsisHorizontalIcon,
	NoSymbolIcon,
} from "@heroicons/react/24/outline";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	user,
	DropdownItem,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";

export default function DropdownUser({
	user,
	setReportModal,
}: {
	user: User;
	setReportModal: (value: boolean) => void;
}) {
	const session = useSession();

	return (
		<Dropdown placement="bottom" className="text-foreground">
			<DropdownTrigger>
				<EllipsisHorizontalIcon className="h-10 transition-dropdown" />
			</DropdownTrigger>
			<DropdownMenu aria-label="User Actions" variant="flat">
				{session.data?.user.id === user.id ? (
					<DropdownItem title="Nenhuma ação" />
				) : (
					<DropdownItem
						key="exit"
						description="Reportar o usuário."
						className="border-radius-sys text-danger"
						onClick={() => {
							setReportModal(true);
						}}
						startContent={<NoSymbolIcon className="h-8" />}
					>
						Reportar @{user.username}
					</DropdownItem>
				)}
			</DropdownMenu>
		</Dropdown>
	);
}
