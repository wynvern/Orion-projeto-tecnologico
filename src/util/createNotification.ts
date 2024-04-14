import { db } from "@/lib/db";

interface NotificationData {
	userId: string;
	title: string;
	description?: string;
	image?: string;
	link?: string;
}

export async function createNotification(data: NotificationData) {
	try {
		const { userId, title, description, image, link } = data;

		const notification = await db.notification.create({
			data: {
				userId,
				title,
				description,
				image,
				link,
			},
		});

		return notification;
	} catch (error) {
		console.error("Error creating notification:", error);
		throw error;
	}
}
