"use client";

import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

import App from "../components/app/App";
import { useEffect, useState } from "react";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [isDarkMode, setIsDarkMode] = useState("1");

	useEffect(() => {
		setIsDarkMode(localStorage.getItem("darkMode") as string);

		const handleDarkModeChange = () => {
			setIsDarkMode(localStorage.getItem("darkMode") as string);
		};

		window.addEventListener("storage", handleDarkModeChange);
		return () => {
			window.removeEventListener("storage", handleDarkModeChange);
		};
	}, []);

	if (isDarkMode === "1") {
		return (
			<html lang="pt-BR">
				<head>
					<link
						rel="shortcut icon"
						href="/brand/logo.svg"
						type="image/x-icon"
					/>
					<title>Orion</title>
					<link rel="manifest" href="/manifest.json" />
				</head>
				<body
					className={`dark ${inter.className} w-screen h-[calc(100dvh)]`}
				>
					<Analytics />
					<SpeedInsights />
					<App>{children}</App>
				</body>
			</html>
		);
	}
	return (
		<html lang="pt-BR">
			<head>
				<link
					rel="shortcut icon"
					href="/brand/logo.svg"
					type="image/x-icon"
				/>
				<title>Orion</title>
			</head>
			<body
				className={`invert-images ${inter.className} w-screen h-[calc(100dvh)] overflow-y-hidden`}
			>
				<Analytics />
				<SpeedInsights />
				<App>{children}</App>
			</body>
		</html>
	);
}
