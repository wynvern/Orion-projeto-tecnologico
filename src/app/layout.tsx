import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

import App from "../components/app/App";
import { useEffect, useState } from "react";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Orion",
	description: "App Orion do Projeto IEI",
	generator: "Next.js",
	manifest: "/manifest.json",
	keywords: ["Orion", "IEI", "Projeto IEI", "App Orion"],
	themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#000000" }],
	authors: [
		{ name: "wynvern" },
		{
			name: "wynvern",
			url: "https://www.github.com/wynvern",
		},
	],
	viewport:
		"minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
	icons: [
		{ rel: "apple-touch-icon", url: "icons/icon-144x144.png" },
		{ rel: "icon", url: "icons/icon-144x144.png" },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	/* 	const [isDarkMode, setIsDarkMode] = useState("1");

	useEffect(() => {
		setIsDarkMode(localStorage.getItem("darkMode") as string);

		const handleDarkModeChange = () => {
			setIsDarkMode(localStorage.getItem("darkMode") as string);
		};

		window.addEventListener("storage", handleDarkModeChange);
		return () => {
			window.removeEventListener("storage", handleDarkModeChange);
		};
	}, []); */

	if ("1" === "1") {
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
