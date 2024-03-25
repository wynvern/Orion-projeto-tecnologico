"use client";

import { useSession } from "next-auth/react";
import { Image } from "@nextui-org/react";
import {
	EllipsisHorizontalIcon,
	PencilIcon,
} from "@heroicons/react/24/outline";

export default function UserPage({ params }: { params: { username: string } }) {
	const session = useSession();

	return (
		<div className="w-full h-full flex items-center justify-center">
			<div className="bg-zinc-600 rounded-large w-[1000px] h-[400px] flex">
				<div>
					<Image
						src="https://i.imgur.com/rZavvMA.png"
						className="h-[400px] w-auto object-cover"
					/>
				</div>
				<div className="flex-grow p-10 flex flex-col justify-between">
					<div>
						<div className="flex justify-between">
							<div>
								<div className="flex items-center gap-x-4">
									<div className="bg-emerald-400 h-7 w-7 rounded-2xl mt-1"></div>
									<div className="flex items-end gap-x-2">
										<h1>username</h1>
										<PencilIcon className="h-6"></PencilIcon>
									</div>
								</div>
							</div>
							<div>
								<EllipsisHorizontalIcon className="h-10"></EllipsisHorizontalIcon>
							</div>
						</div>
						<div className="ml-11 mt-2">
							<p>@name</p>
						</div>
						<div>
							<p className="max-w-[400px] mt-4">
								Lorem, ipsum dolor sit amet consectetur
								adipisicing elit. Architecto nam ipsam enim
								obcaecati, repellat vero doloribus molestias
								perspiciatis nesciunt reprehenderit ducimus
								nobis aliquam impedit illum debitis.
							</p>
						</div>
					</div>
					<div className="flex gap-x-4">
						<p>
							<b>Posts </b>0
						</p>
						<p>
							<b>Salvos </b>0
						</p>
						<p>
							<b>Grupos </b>0
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
