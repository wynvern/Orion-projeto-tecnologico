import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

import App from "../components/app/App";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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
			<body className={`${inter.className} w-screen h-[calc(100dvh)]`}>
				<App>{children}</App>
			</body>
		</html>
	);
}
