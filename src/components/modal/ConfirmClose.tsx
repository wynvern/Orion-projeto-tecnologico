import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@nextui-org/react";

interface ConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
}

const ConfirmationModal = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
}: ConfirmationModalProps) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} className="text-foreground">
			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalBody>{message}</ModalBody>
				<ModalFooter>
					<Button
						color="primary"
						onClick={onClose}
						startContent={<XMarkIcon className="h-6" />}
					>
						Cancelar
					</Button>
					<Button
						color="danger"
						onClick={onConfirm}
						startContent={<CheckIcon className="h-6" />}
					>
						Confirmar
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ConfirmationModal;
