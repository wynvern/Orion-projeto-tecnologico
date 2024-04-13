import request from "@/util/api";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Image, Link } from "@nextui-org/react";

interface NotificationsProps {
	isActive: boolean;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Notifications({
	isActive,
	setIsActive,
}: NotificationsProps) {
	const [notifications, setNotifications] = useState([]);

	async function fetchNotifications() {
		const data = await request("/api/notification");
		setNotifications(data.notifications);
	}

	useEffect(() => {
		if (isActive) fetchNotifications();
	}, [isActive]);

	return (
		<Modal
			size="3xl"
			isOpen={isActive}
			className="text-foreground py-4"
			onOpenChange={() => {
				setIsActive(false);
			}}
			backdrop="blur"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 pt-1">
							Notificações
						</ModalHeader>
						<ModalBody className="py-2 pb-6">
							{notifications.map((i: any, _: number) => (
								<div
									key={_}
									className="bg-default-100 p-4 rounded-large"
								>
									<h3>{i.title}</h3>
								</div>
							))}
							{notifications.length < 1 ? (
								<h2>Nenhuma notificação</h2>
							) : (
								""
							)}
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
