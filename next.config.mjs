import { default as withPWA } from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */

const nextConfig = withPWA({
	dest: "public",
	cacheOnFrontEndNav: true,
	aggressiveFrontEndNavCaching: true,
	reloadOnOnline: true,
	swcMinify: true,
	disable: process.env.NODE_ENV === "development",
	workboxOptions: {
		disableDevLogs: true,
	},
	images: {
		domains: [
			"localhost",
			"lh3.googleusercontent.com",
			"orion-iei.vercel.app",
		],
	},
	// ... other options you like
});

export default withPWA(nextConfig);
