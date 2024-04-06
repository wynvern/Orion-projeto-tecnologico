"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import Sidebar from "../Sidebar/Sidebar";
import { usePathname } from "next/navigation";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const notVisibleSidebarPages = [
		"/login",
		"/signup",
		"/finish",
		"/forgot-password",
	];

	return (
		<NextUIProvider className="dark w-full h-full">
			<SessionProvider>
				{!notVisibleSidebarPages.includes(pathname) && <Sidebar />}
				<div
					className={`w-full h-full ${
						!notVisibleSidebarPages.includes(pathname) && "pl-20"
					}`}
				>
					{children}
				</div>
			</SessionProvider>
		</NextUIProvider>
	);
}
