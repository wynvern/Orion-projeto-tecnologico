"use client";

import { Image } from "@nextui-org/react";
import {
	EllipsisHorizontalIcon,
	PencilIcon,
} from "@heroicons/react/24/outline";
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
			<div className="bg-zinc-600 rounded-large w-[1000px] h-[400px] flex">
				<div>
					<Image
						draggable={false}
						src={group.image ?? "/brand/default-group.svg"}
						className="h-[400px] w-auto object-cover"
					/>
				</div>
				<div className="flex-grow p-10 flex flex-col justify-between">
					<div>
						<div className="flex justify-between">
							<div>
								<div className="flex items-center gap-x-4">
									<div className="flex items-end gap-x-2">
										<h1>{group.name}</h1>
										<PencilIcon className="h-6"></PencilIcon>
									</div>
								</div>
							</div>
							<div>
								<EllipsisHorizontalIcon className="h-10"></EllipsisHorizontalIcon>
							</div>
						</div>
						<div>
							<p className="max-w-[400px] mt-4">
								{group.description}
							</p>
						</div>
					</div>
					<div className="flex gap-x-4">
						<p>
							<b>Posts </b>0
						</p>
						<p>
							<b>Participantes </b>0
						</p>
						<p>
							<b>Visualizações </b>0
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
