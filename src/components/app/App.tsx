"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import Sidebar from "../Sidebar/Sidebar";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

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
		"/new-password",
		"/verify-email",
		"/not-found",
	];

	return (
		<NextUIProvider className="w-full h-full">
			<SessionProvider>
				<Suspense>
					{!notVisibleSidebarPages.includes(pathname) && <Sidebar />}
					<div
						className={`min-w-full min-h-full text-foreground bg-background overflow-y-scroll ${
							!notVisibleSidebarPages.includes(pathname) &&
							"sm:pl-20 pb-20 sm:pb-0"
						}`}
						style={{ scrollbarWidth: "none" }}
					>
						{children}
					</div>
				</Suspense>
			</SessionProvider>
		</NextUIProvider>
	);
}
