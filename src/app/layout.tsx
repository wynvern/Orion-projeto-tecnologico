"use client";

import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

import App from "../components/app/App";
import { useEffect, useState } from "react";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [isDarkMode, setIsDarkMode] = useState(true);

	useEffect(() => {
		const isDarkModeEnabled = localStorage.getItem("darkMode") === "1";
		setIsDarkMode(isDarkModeEnabled);

		const handleDarkModeChange = () => {
			setIsDarkMode(localStorage.getItem("darkMode") === "1");
		};

		window.addEventListener("storage", handleDarkModeChange);
		return () => {
			window.removeEventListener("storage", handleDarkModeChange);
		};
	}, []);

	if (isDarkMode) {
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
					<App>{children}</App>
				</body>
			</html>
		);
	} else {
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
					className={`${inter.className} w-screen h-[calc(100dvh)] overflow-y-hidden`}
				>
					<App>{children}</App>
				</body>
			</html>
		);
	}
}
