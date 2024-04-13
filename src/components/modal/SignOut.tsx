import {
	ArrowLeftStartOnRectangleIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";
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

	return (
		<Modal
			size="md"
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
							Sair
						</ModalHeader>
						<ModalBody className="py-2 ">
							Ao sair, você perderá o acesso temporário. No
							entanto, seus dados permanecerão seguros e você
							poderá efetuar login novamente a qualquer momento.
						</ModalBody>
						<ModalFooter className="py-0">
							<Button
								color="danger"
								onClick={() => {
									handleSignOut();
								}}
								style={{ lineHeight: "1.5" }}
								isLoading={loading}
								startContent={
									loading ? (
										""
									) : (
										<ArrowLeftStartOnRectangleIcon className="h-6" />
									)
								}
							>
								Sair
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
