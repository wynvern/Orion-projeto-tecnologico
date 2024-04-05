"use client";

import {
	ArrowLeftEndOnRectangleIcon,
	Cog6ToothIcon,
	InformationCircleIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Image,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfileDropdown() {
	const router = useRouter();
	const session = useSession();

	console.log(session);

	return (
		<>
			<Dropdown placement="right" className="dark">
				<DropdownTrigger>
					<div className="h-8 w-8">
						<Image
							alt="default"
							src={
								session.data != undefined
									? session.data.user.image
									: "/brand/default-user.svg"
							}
							classNames={{ img: "h-8 rounded-full" }}
							removeWrapper={true}
						></Image>
					</div>
				</DropdownTrigger>
				<DropdownMenu aria-label="User Actions" variant="flat">
					<DropdownItem
						disableAnimation={true}
						key="info_user"
						className="h-14 gap-2 border-radius-sys pl-5"
						textValue="aa"
					>
						<p className="font-bold">
							<b>@username</b>
						</p>
					</DropdownItem>
					<DropdownItem
						key="profile"
						description="Veja o seu perfil"
						className="border-radius-sys"
						startContent={<UserIcon className="h-8" />}
						onClick={() => router.push("/u/")}
					>
						Perfil
					</DropdownItem>
					<DropdownItem
						key="info"
						description="Veja guias e contribua"
						className="border-radius-sys"
						startContent={<InformationCircleIcon className="h-8" />}
					>
						Ajuda e Feedback
					</DropdownItem>
					<DropdownItem
						key="exit"
						description="Desconecte-se de sua conta"
						className="border-radius-sys text-danger"
						startContent={
							<ArrowLeftEndOnRectangleIcon className="h-8" />
						}
					>
						Sair
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</>
	);
}
