"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<NextUIProvider className="dark w-screen h-screen">
			<SessionProvider>{children}</SessionProvider>
		</NextUIProvider>
	);
}
