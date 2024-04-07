import { Button, Image } from "@nextui-org/react";
import {
	EllipsisHorizontalIcon,
	PencilIcon,
	UserPlusIcon,
} from "@heroicons/react/24/outline";

export default function GroupCard({ group }: { group: any }) {
	return (
		<div
			className={`rounded-large  w-[1000px] h-[400px] flex object-contain relative ${
				group.banner ? "" : "bg-zinc-600"
			}`}
		>
			<div
				className="absolute w-[700px] h-[400px] rounded-large right-0 opacity-40 bg-cover bg-center"
				style={{
					backgroundImage: `url(${group.banner})`,
				}}
			></div>
			<div>
				<Image
					draggable={false}
					src={group.logo ?? "/brand/default-group.svg"}
					className="h-[400px] w-auto object-cover"
				/>
			</div>
			<div className="flex-grow p-10 flex flex-col justify-between z-10">
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
					<div className="mt-2">
						<p>@{group.name}</p>
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
				<div>
					<Button isIconOnly={true} className="rounded-full p-4">
						<UserPlusIcon />
					</Button>
				</div>
			</div>
		</div>
	);
}
