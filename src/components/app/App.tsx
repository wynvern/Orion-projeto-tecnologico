"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import Sidebar from "../Sidebar/Sidebar";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
					<SpeedInsights />
					{!notVisibleSidebarPages.includes(pathname) && <Sidebar />}
					<div
						className={`w-full h-full  text-foreground bg-background ${
							!notVisibleSidebarPages.includes(pathname) &&
							"pl-20"
						}`}
					>
						{children}
					</div>
				</Suspense>
			</SessionProvider>
		</NextUIProvider>
	);
}
