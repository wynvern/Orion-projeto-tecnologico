import { PlusIcon } from "@heroicons/react/24/outline";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
} from "@nextui-org/react";
import { useState } from "react";

interface CreatePostProps {
	isActive: boolean;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreatePost({ isActive, setIsActive }: CreatePostProps) {
	const [wordCount, setWordCount] = useState(0);
	const [loading, setLoading] = useState(false);

	async function createPost() {
		console.log("criando post");
	}

	return (
		<Modal
			size="3xl"
			isOpen={isActive}
			className="dark py-4"
			onOpenChange={() => {
				setIsActive(false);
				setWordCount(0);
			}}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 pt-1">
							Criar Post
						</ModalHeader>
						<ModalBody className="py-6">
							<Textarea
								size="lg"
								placeholder="Digite aqui..."
								onValueChange={(e) => {
									setWordCount(e.length);
								}}
							/>
							<div>
								<p className="text-neutral-600">
									{wordCount}/200
								</p>
							</div>
						</ModalBody>
						<ModalFooter className="flex justify-between">
							<Button
								color="primary"
								onClick={() => {
									createPost();
									onClose();
								}}
								style={{ lineHeight: "1.5" }}
								isLoading={loading}
							>
								Criar
								<PlusIcon className="h-1/2" />
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
