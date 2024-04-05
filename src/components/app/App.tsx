"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import Sidebar from "../Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [sidebarVisible, setSidebarVisible] = useState(false);
	const pathname = usePathname();
	const notVisibleSidebarPages = ["/login", "/signup", "/finish"];

	useEffect(() => {
		if (notVisibleSidebarPages.includes(pathname)) setSidebarVisible(false);
		else setSidebarVisible(true);
	});

	return (
		<NextUIProvider className="dark w-screen h-screen">
			<SessionProvider>
				{sidebarVisible && <Sidebar />}
				<div
					className={`w-screen h-screen ${sidebarVisible && "pl-20"}`}
				>
					{children}
				</div>
			</SessionProvider>
		</NextUIProvider>
	);
}
