// Configuration options for Next.js
const nextConfig = {
	reactStrictMode: true, // Enable React strict mode for improved error handling
	swcMinify: true, // Enable SWC minification for improved performance
	compiler: {
		removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
	},
};

import withPWAInit from "@ducanh2912/next-pwa";

// Configuration object tells the next-pwa plugin
const withPWA = withPWAInit({
	dest: "public", // Destination directory for the PWA files
	disable: false, // Disable PWA in development mode
	register: true, // Register the PWA service worker
	skipWaiting: true, // Skip waiting for service worker activation
});

// Export the combined configuration for Next.js with PWA support
export default withPWA(nextConfig);
