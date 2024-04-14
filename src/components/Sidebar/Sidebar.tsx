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

import { Link } from "@nextui-org/react";
import Image from "next/image";
import ProfileDropdown from "../extra/ProfileDropdown";
import { usePathname } from "next/navigation";

export default function Sidebar() {
	const url = usePathname();

	return (
		<div className="fixed h-screen w-20 items-center justify-between flex flex-col py-6">
			<div>
				<Link href="/">
					<Image
						src="/brand/logo.svg"
						className="h-8 inverted-image"
						alt="logo"
						width={40}
						height={40}
					/>
				</Link>
			</div>
			<div className="gap-y-12 flex flex-col items-center">
				<Link className="text-foreground" href="/search">
					<MagnifyingGlassIcon className="h-8" />
				</Link>
				<Link href="/bookmarks" className="text-foreground">
					{url == "/bookmarks" ? (
						<SolidBookmarkIcon className="h-8" />
					) : (
						<BookmarkIcon className="h-8" />
					)}
				</Link>
				<Link href="/groups" className="text-foreground">
					{url == "/groups" ? (
						<SolidUserGroupIcon className="h-8" />
					) : (
						<UserGroupIcon className="h-8" />
					)}
				</Link>
				<ProfileDropdown />
			</div>
			<div>
				<Cog6ToothIcon className="h-8 text-foreground" />
			</div>
		</div>
	);
}
