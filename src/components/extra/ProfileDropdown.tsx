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
	Button,
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
			<Dropdown
				placement="right"
				className="text-foreground"
				aria-label="Profile Dropdown"
			>
				<DropdownTrigger>
					<Button
						isIconOnly={true}
						className="!p-0 bg-transparent w-8 h-8"
						aria-label="Toggle Dropdown"
					>
						<Image
							src={
								session.data?.user.image ??
								"/brand/default-user.svg"
							}
							removeWrapper={true}
							alt="avatar-user"
							className={`w-8 h-8 rounded-full ${
								pathname.includes(
									`/u/${session.data?.user.username}`
								)
									? "border-2 border-white"
									: ""
							}`}
						/>
					</Button>
				</DropdownTrigger>
				<DropdownMenu aria-label="User Actions" variant="flat">
					<DropdownItem
						className="h-10 gap-2 pl-3"
						aria-label="Username"
					>
						<p className="font-bold">
							<b>@{session.data?.user.username}</b>
						</p>
					</DropdownItem>
					<DropdownItem
						onClick={toggleDarkMode}
						startContent={
							isDarkMode ? (
								<SunIcon
									className="h-8"
									aria-label="Light Mode"
								/>
							) : (
								<MoonIcon
									className="h-7 p-[0.5px]"
									aria-label="Dark Mode"
								/>
							)
						}
						description="Troque para outro tema"
						aria-label="Toggle Dark Mode"
					>
						Modo {isDarkMode ? "claro" : "escuro"}
					</DropdownItem>
					<DropdownItem
						description="Veja o seu perfil"
						className="border-radius-sys"
						startContent={
							<UserIcon className="h-8" aria-label="Profile" />
						}
						onClick={() =>
							router.push(`/u/${session.data?.user.username}`)
						}
						aria-label="Go to Profile"
					>
						Perfil
					</DropdownItem>
					<DropdownItem
						description="Veja as suas notificações"
						className="border-radius-sys"
						startContent={
							<BellIcon
								className="h-8"
								aria-label="Notifications"
							/>
						}
						onClick={() => setNotificationsModal(true)}
						aria-label="Toggle Notifications"
					>
						Notificações
					</DropdownItem>
					<DropdownItem
						description="Veja guias e contribua"
						className="border-radius-sys"
						startContent={
							<InformationCircleIcon
								className="h-8"
								aria-label="Help and Feedback"
							/>
						}
						aria-label="Help and Feedback"
					>
						Ajuda e Feedback
					</DropdownItem>
					<DropdownItem
						description="Desconecte-se de sua conta"
						className="border-radius-sys text-danger"
						onClick={() => {
							setSignOutModal(true);
						}}
						startContent={
							<ArrowLeftEndOnRectangleIcon
								className="h-8"
								aria-label="Sign Out"
							/>
						}
						aria-label="Sign Out"
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
