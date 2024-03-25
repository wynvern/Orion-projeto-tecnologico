"use client";

import { useSession } from "next-auth/react";

export default function Home() {
	const session = useSession();

	console.log(session);

	return (
		<div>
			<img src={""} alt="" />
			<p>Hello World, nothing here</p>
		</div>
	);
}
