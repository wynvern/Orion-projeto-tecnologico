"use client";

import { NextUIProvider } from "@nextui-org/react";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<NextUIProvider className="dark w-screen h-screen">
			{children}
		</NextUIProvider>
	);
}
