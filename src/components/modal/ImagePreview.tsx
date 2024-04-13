import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Link, Modal, ModalBody, ModalContent, Image } from "@nextui-org/react";
import { useState } from "react";

interface ImagePreviewProps {
	isActive: boolean;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
	images: string[];
}

export default function ImagePreview({
	isActive,
	setIsActive,
	images,
}: ImagePreviewProps) {
	const [imagePos, setImagePost] = useState(0);

	return (
		<Modal
			size="full"
			isOpen={isActive}
			className="text-foreground py-4"
			onOpenChange={() => {
				setIsActive(false);
			}}
			backdrop="blur"
		>
			<ModalContent className="bg-transparent shadow-none relative overflow-y-hidden  flex justify-center items-center">
				{(onClose) => (
					<ModalBody className="relative w-1/2 h-full">
						<div className="absolute right-0 h-full flex items-center z-50">
							<div>
								<Link
									className="text-foreground"
									onClick={() => setImagePost(imagePos + 1)}
									isDisabled={imagePos == images.length - 1}
								>
									<ChevronRightIcon className="h-6" />
								</Link>
							</div>
						</div>
						<div className="absolute left-0 h-full flex items-center z-50">
							<div>
								<Link
									isDisabled={imagePos < 1}
									className="text-foreground"
									onClick={() => setImagePost(imagePos - 1)}
								>
									<ChevronLeftIcon className="h-6" />
								</Link>
							</div>
						</div>
						<div className="w-full h-full flex items-center justify-center relative">
							<Image
								className="max-w-full max-h-full rounded-none absolute"
								removeWrapper={true}
								src={images[imagePos]}
							></Image>
							<div className="fixed  bottom-8 flex gap-x-2 w-[300px] z-50">
								{images.map((i: any, _: number) => (
									<div
										className={`h-2 flex-grow transition-colors duration-300 rounded-full ${
											imagePos == _
												? "bg-white"
												: "bg-default-100"
										}`}
										key={_}
										onClick={() => setImagePost(_)}
										aria-label={i}
									></div>
								))}
							</div>
						</div>
					</ModalBody>
				)}
			</ModalContent>
		</Modal>
	);
}
