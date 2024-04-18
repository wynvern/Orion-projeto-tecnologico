import type User from "@/types/User";
import {
	EllipsisHorizontalIcon,
	NoSymbolIcon,
	PencilIcon,
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
	setCustomizeProfileModal,
}: {
	user: User;
	setReportModal: (value: boolean) => void;
	setCustomizeProfileModal: (value: boolean) => void;
}) {
	const session = useSession();

	return (
		<Dropdown placement="bottom" className="text-foreground">
			<DropdownTrigger>
				<EllipsisHorizontalIcon className="h-10 transition-dropdown" />
			</DropdownTrigger>
			<DropdownMenu aria-label="User Actions" variant="flat">
				{session.data?.user.id === user.id ? (
					<DropdownItem
						key="customize"
						description="Personalize seu perfil."
						className="border-radius-sys"
						onClick={() => {
							setCustomizeProfileModal(true);
						}}
						startContent={<PencilIcon className="h-8" />}
					>
						Personalizar perfil
					</DropdownItem>
				) : (
					<DropdownItem
						key="exit"
						description="Reportar o usuário."
						className="border-radius-sys text-danger"
						onClick={() => {
							setReportModal(true);
						}}
						startContent={
							<NoSymbolIcon className="h-8 text-danger" />
						}
					>
						Reportar @{user.username}
					</DropdownItem>
				)}
			</DropdownMenu>
		</Dropdown>
	);
}
