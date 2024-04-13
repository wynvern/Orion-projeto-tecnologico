"use client";

import {
	ArrowLeftEndOnRectangleIcon,
	BellIcon,
	InformationCircleIcon,
	MoonIcon,
	SunIcon,
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
import { usePathname, useRouter } from "next/navigation";
import SignOut from "../modal/SignOut";
import { useEffect, useState } from "react";
import Notifications from "../modal/Notifications";

export default function ProfileDropdown() {
	const router = useRouter();
	const session = useSession();
	const [signOutModal, setSignOutModal] = useState(false);
	const pathname = usePathname();
	const [notificationsModal, setNotificationsModal] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [toggleDarkmode, setTriggerDarkmode] = useState("no");

	useEffect(() => {
		const isDarkModeEnabled = localStorage.getItem("darkMode") === "1";
		setIsDarkMode(isDarkModeEnabled);
	}, []);

	const toggleDarkMode = () => {
		setTriggerDarkmode("yes");
	};

	useEffect(() => {
		if (toggleDarkmode == "yes") {
			const newDarkModeValue = (
				localStorage.getItem("darkMode") == "1" ? true : false
			)
				? "0"
				: "1";

			localStorage.setItem("darkMode", newDarkModeValue);
			setIsDarkMode(!isDarkMode);
			setTriggerDarkmode("no");
			window.location.reload();
		}
	}, [toggleDarkmode]);

	// TODO: Fix the error message that shows on terminal that comes from here, but don't know what is causing it, plus error with keyframes
	return (
		<>
			<Dropdown placement="right" className="text-foreground">
				<DropdownTrigger>
					<div className="h-8 w-8 transition-dropdown">
						<Image
							src={
								session.data?.user.image ??
								"/brand/default-user.svg"
							}
							classNames={{ img: "h-8 rounded-full" }}
							removeWrapper={true}
							alt="avatar-user"
							className={`${
								pathname.includes(
									`/u/${session.data?.user.username}`
								)
									? "border-2 border-white"
									: ""
							}`}
						></Image>
					</div>
				</DropdownTrigger>
				<DropdownMenu aria-label="User Actions" variant="flat">
					<DropdownItem
						key="info_user"
						className="h-10 gap-2 border-radius-sys pl-3"
					>
						<p className="font-bold">
							<b>@{session.data?.user.username}</b>
						</p>
					</DropdownItem>
					<DropdownItem
						onClick={toggleDarkMode}
						startContent={
							isDarkMode ? (
								<SunIcon className="h-8" />
							) : (
								<MoonIcon className="h-7 p-[0.5px]" />
							)
						}
						description="Troque para outro tema"
					>
						Modo {isDarkMode ? "claro" : "escuro"}
					</DropdownItem>
					<DropdownItem
						key="profile"
						description="Veja o seu perfil"
						className="border-radius-sys"
						startContent={<UserIcon className="h-8" />}
						onClick={() =>
							router.push(`/u/${session.data?.user.username}`)
						}
					>
						Perfil
					</DropdownItem>
					<DropdownItem
						key="notifications"
						description="Veja as suas notificações"
						className="border-radius-sys"
						startContent={<BellIcon className="h-8" />}
						onClick={() => setNotificationsModal(true)}
					>
						Notificações
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
						onClick={() => {
							setSignOutModal(true);
						}}
						startContent={
							<ArrowLeftEndOnRectangleIcon className="h-8" />
						}
					>
						Sair
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>

			<Notifications
				isActive={notificationsModal}
				setIsActive={setNotificationsModal}
			/>
			<SignOut isActive={signOutModal} setIsActive={setSignOutModal} />
		</>
	);
}
