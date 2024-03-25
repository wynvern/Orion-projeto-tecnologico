import {
	BookmarkIcon,
	Cog6ToothIcon,
	MagnifyingGlassIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Image } from "@nextui-org/react";

export default function Sidebar() {
	return (
		<div className="fixed h-screen w-20 items-center justify-between flex flex-col py-6">
			<div>
				<Image src="/brand/logo.svg" className="h-8" />
			</div>
			<div className="gap-y-4 flex flex-col">
				<MagnifyingGlassIcon className="h-8" />
				<BookmarkIcon className="h-8" />
				<UserGroupIcon className="h-8" />
				<Image
					src="/brand/default-user.svg"
					removeWrapper={true}
					classNames={{ img: "h-8 w-8 !rounded-full" }}
				></Image>
			</div>
			<div>
				<Cog6ToothIcon className="h-8" />
			</div>
		</div>
	);
}
