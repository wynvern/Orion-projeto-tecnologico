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
import { signOut } from "next-auth/react";
import { useState } from "react";

interface SignOutProps {
	isActive: boolean;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SignOut({ isActive, setIsActive }: SignOutProps) {
	const [loading, setLoading] = useState(false);
	async function handleSignOut() {
		setLoading(true);
		signOut();
	}

	async function SignOut() {
		console.log("criando post");
	}

	return (
		<Modal
			size="3xl"
			isOpen={isActive}
			className="dark"
			onOpenChange={() => {
				setIsActive(false);
			}}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 pt-1">
							Sair
						</ModalHeader>
						<ModalBody className="py-6"></ModalBody>
						<ModalFooter className="flex justify-between">
							<Button
								color="primary"
								onClick={() => {
									handleSignOut();
								}}
								style={{ lineHeight: "1.5" }}
								isLoading={loading}
							>
								Sair
								<PlusIcon className="h-1/2" />
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
