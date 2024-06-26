import { UserMinusIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function EnterGroupButton({
	group,
	onLoad,
}: {
	group: any;
	onLoad?: () => void;
}) {
	const [isIn, setIsIn] = useState(false);

	useEffect(() => {
		const fetchGroupStatus = async () => {
			try {
				const response = await fetch(`/api/group/${group.id}/in`);
				const data = await response.json();
				setIsIn(data.message === "following");
				if (onLoad) onLoad();
			} catch (error) {
				console.error("Error fetching group status:", error);
			}
		};

		if (group.id) fetchGroupStatus();
	}, [group.id]);

	const handleButtonClick = async () => {
		try {
			const method = isIn ? "DELETE" : "POST";
			await fetch(`/api/group/${group.id}/in`, { method });
			setIsIn(!isIn);
		} catch (error) {
			console.error("Error updating group status:", error);
		}
	};

	return (
		<Button
			isIconOnly={true}
			className="h-14 w-14"
			size="lg"
			color={isIn ? "default" : "primary"}
			onClick={handleButtonClick}
			aria-label={isIn ? "Remove from group" : "Add to group"}
		>
			{isIn ? (
				<UserMinusIcon className="h-6" />
			) : (
				<UserPlusIcon className="h-6 w-6" />
			)}
		</Button>
	);
}
