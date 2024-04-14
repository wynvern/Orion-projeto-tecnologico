import request from "@/util/api";
import { prettyDateTime } from "@/util/prettyDateTime";
import {
	Link,
	Modal,
	ModalBody,
	ModalContent,
	Image,
	ModalHeader,
	CircularProgress,
	ScrollShadow,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

interface NotificationsProps {
	isActive: boolean;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Notifications({
	isActive,
	setIsActive,
}: NotificationsProps) {
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoading] = useState(true);

	async function fetchNotifications() {
		setLoading(true);
		const data = await request("/api/notification");
		setNotifications(data.notifications);
		console.log(data);
		setLoading(false);
	}

	async function setAsViewed() {
		await request("/api/notification", "PATCH");
	}

	useEffect(() => {
		if (isActive) {
			fetchNotifications();
			setAsViewed();
		}
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
				{() => (
					<>
						<ModalHeader className="flex flex-col gap-1 pt-1">
							<h3>Notificações</h3>
						</ModalHeader>
						<ModalBody className="py-2 pb-6">
							<ScrollShadow
								className="max-h-[600px] oveflow-y-scroll"
								orientation="vertical"
							>
								{loading ? (
									<div className="w-full h-full flex items-center justify-center">
										<CircularProgress size="lg" />
									</div>
								) : notifications.length < 1 ? (
									<h3>Nenhuma notificação</h3>
								) : (
									<>
										<h3 className="">Novas</h3>
										<div className="flex flex-col gap-y-3 mt-2">
											{notifications
												.filter((i: any) => !i.viewed)
												.map((i: any, _: number) => (
													<div
														key={_}
														className={`bg-default-100 p-3 rounded-large ${
															i.viewed
																? "opacity-[50%]"
																: ""
														}`}
													>
														<Link
															className="text-foreground flex h-full w-full items-center gap-x-4"
															href={i.link}
														>
															<Image
																src={i.image}
																className="h-10 w-10 rounded-full"
																removeWrapper={
																	true
																}
															/>
															<div className="flex flex-col">
																<div className="flex items-center gap-x-1">
																	<h3 className="font-bold">
																		{
																			i.title
																		}
																	</h3>
																	<p className="text-foreground">
																		•
																	</p>
																	<p>
																		{prettyDateTime(
																			i.createdAt
																		)}
																	</p>
																</div>
																<p>
																	{
																		i.description
																	}
																</p>
															</div>
														</Link>
													</div>
												))}
										</div>
										<h3 className="mt-4">Antigas</h3>
										<div className="flex flex-col gap-y-3 mt-2">
											{notifications
												.filter((i: any) => i.viewed)
												.map((i: any, _: number) => (
													<div
														key={_}
														className={`bg-default-100 p-3 rounded-large ${
															i.viewed
																? "opacity-[50%]"
																: ""
														}`}
													>
														<Link
															className="text-foreground flex h-full w-full items-center gap-x-4"
															href={i.link}
														>
															<Image
																src={i.image}
																className="h-10 w-10 rounded-full"
																removeWrapper={
																	true
																}
															/>
															<div className="flex flex-col">
																<div className="flex items-center gap-x-1">
																	<h3 className="font-bold">
																		{
																			i.title
																		}
																	</h3>
																	<p className="text-foreground">
																		•
																	</p>
																	<p>
																		{prettyDateTime(
																			i.createdAt
																		)}
																	</p>
																</div>
																<p>
																	{
																		i.description
																	}
																</p>
															</div>
														</Link>
													</div>
												))}
										</div>
									</>
								)}
							</ScrollShadow>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
