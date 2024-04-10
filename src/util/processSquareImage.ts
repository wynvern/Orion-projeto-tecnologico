import sharp from "sharp";

export const processSquareImage = async (
	buffer: Buffer,
	maxSize: number = 500
): Promise<string> => {
	try {
		const metadata = await sharp(buffer).metadata();

		if (metadata.width && metadata.height) {
			const processedImage = await sharp(buffer)
				.png({ quality: 40 }) // Convert to PNG format
				.withMetadata() // Keep image metadata (e.g., orientation)
				.resize({
					width: 500,
					height: 500,
					fit: "cover",
					position: "centre",
				})
				.toBuffer();

			const processedBase64 = processedImage.toString("base64");
			return processedBase64;
		} else {
			throw new Error("Some metadata is missing.");
		}
	} catch (error) {
		console.error("Error processing image:", error);
		throw error;
	}
};

export const processAnyImage = async (buffer: Buffer): Promise<string> => {
	try {
		const metadata = await sharp(buffer).metadata();

		if (metadata.width && metadata.height) {
			const processedImage = await sharp(buffer)
				.png({ quality: 40 }) // Convert to PNG format
				.withMetadata() // Keep image metadata (e.g., orientation)
				.toBuffer();

			const processedBase64 = processedImage.toString("base64");
			return processedBase64;
		} else {
			throw new Error("Some metadata is missing.");
		}
	} catch (error) {
		console.error("Error processing image:", error);
		throw error;
	}
};
