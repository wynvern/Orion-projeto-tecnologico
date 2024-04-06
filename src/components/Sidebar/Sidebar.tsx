import {
	BookmarkIcon,
	Cog6ToothIcon,
	MagnifyingGlassIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Image, Link } from "@nextui-org/react";
import ProfileDropdown from "../extra/ProfileDropdown";

export default function Sidebar() {
	return (
		<div className="fixed h-screen w-20 items-center justify-between flex flex-col py-6">
			<div>
				<Image src="/brand/logo.svg" className="h-8" />
			</div>
			<div className="gap-y-12 flex flex-col">
				<MagnifyingGlassIcon className="h-8" />
				<BookmarkIcon className="h-8" />
				<Link href="/groups" className="text-white">
					<UserGroupIcon className="h-8" />
				</Link>
				<ProfileDropdown />
			</div>
			<div>
				<Cog6ToothIcon className="h-8" />
			</div>
		</div>
	);
}
