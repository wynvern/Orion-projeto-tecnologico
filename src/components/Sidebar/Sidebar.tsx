import {
	BookmarkIcon,
	Cog6ToothIcon,
	MagnifyingGlassIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
	UserGroupIcon as SolidUserGroupIcon,
	BookmarkIcon as SolidBookmarkIcon,
} from "@heroicons/react/24/solid";

import { Image, Link } from "@nextui-org/react";
import ProfileDropdown from "../extra/ProfileDropdown";
import { usePathname } from "next/navigation";

export default function Sidebar() {
	const url = usePathname();

	return (
		<div className="fixed h-screen w-20 items-center justify-between flex flex-col py-6">
			<div>
				<Link href="/">
					<Image src="/brand/logo.svg" className="h-8" alt="logo" />
				</Link>
			</div>
			<div className="gap-y-12 flex flex-col">
				<MagnifyingGlassIcon className="h-8" />
				<Link href="/bookmarks" className="text-white">
					{url == "/bookmarks" ? (
						<SolidBookmarkIcon className="h-8" />
					) : (
						<BookmarkIcon className="h-8" />
					)}
				</Link>
				<Link href="/groups" className="text-white">
					{url == "/groups" ? (
						<SolidUserGroupIcon className="h-8" />
					) : (
						<UserGroupIcon className="h-8" />
					)}
				</Link>
				<ProfileDropdown />
			</div>
			<div>
				<Cog6ToothIcon className="h-8" />
			</div>
		</div>
	);
}
