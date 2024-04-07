"use client";

import GroupCard from "@/components/Cards/GroupCard";
import { useEffect, useState } from "react";

export default function GroupPage({ params }: { params: { name: string } }) {
	const [group, setGroup] = useState({
		groupname: "",
		name: "",
		image: "",
		description: "",
	});

	async function fetchgroup() {
		try {
			const response = await fetch(
				`/api/query/group?name=${params.name}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				setGroup(data.groups[0]);
			}
		} catch (e: any) {
			console.error("Error:", e.message); //mudar
		}
	}

	useEffect(() => {
		fetchgroup();
	}, []);

	return (
		<div className="w-full h-full flex items-center justify-center">
			<GroupCard group={group} />
		</div>
	);
}
