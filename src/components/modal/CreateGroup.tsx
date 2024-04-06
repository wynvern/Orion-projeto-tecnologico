import {
	AtSymbolIcon,
	PencilIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
} from "@nextui-org/react";
import { useState } from "react";

interface CreateGroupProps {
	isActive: boolean;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateGroup({
	isActive,
	setIsActive,
}: CreateGroupProps) {
	const [wordCount, setWordCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [inputNameVal, setInputNameVal] = useState({
		message: "",
		active: false,
	});
	const [inputDescriptionVal, setInputDescriptionVal] = useState({
		message: "",
		active: false,
	});

	async function handleCreateGroup(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setLoading(true);
		const formData = new FormData(e.currentTarget);
		const formDesc: string = formData.get("description") as string;
		const formName: string = formData.get("name") as string;

		if (formName === "" || formName.length < 2 || formName.length > 20) {
			setInputNameVal({
				message: "Nome de grupo não aceito.",
				active: true,
			});
			setLoading(false);
			return false;
		}

		if (formDesc.length > 200 || formDesc.length < 1) {
			setInputDescriptionVal({
				message: "Descrição de grupo inválida.",
				active: true,
			});
			setLoading(false);
			return false;
		}

		CreateGroup(
			formData.get("name") as string,
			formData.get("description") as string
		);
	}

	async function CreateGroup(name: string, description: string) {
		try {
			const response = await fetch("/api/group", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					description,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				console.log(data);
			} else {
				const data = await response.json();
				if (data.message == "name-already-in-use") {
					setInputNameVal({
						message: "Nome de grupo já está em uso.",
						active: true,
					});
				}
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
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
							Criar Grupo
						</ModalHeader>
						<form onSubmit={handleCreateGroup}>
							<ModalBody className="py-2 pb-6">
								<Input
									type="text"
									placeholder="Nome"
									name="name"
									classNames={{ inputWrapper: "h-14" }}
									startContent={
										<AtSymbolIcon className="h-6 text-neutral-500" />
									}
									isInvalid={inputNameVal.active}
									errorMessage={inputNameVal.message}
									onValueChange={() => {
										setInputNameVal({
											message: "",
											active: false,
										});
									}}
								></Input>
								<Textarea
									type="text"
									placeholder="Descrição"
									name="description"
									classNames={{ inputWrapper: "h-14" }}
									startContent={
										<PencilIcon className="h-6 text-neutral-500" />
									}
									isInvalid={inputDescriptionVal.active}
									errorMessage={inputDescriptionVal.message}
									onValueChange={() => {
										setInputDescriptionVal({
											message: "",
											active: false,
										});
									}}
								></Textarea>
							</ModalBody>
							<ModalFooter className="flex justify-between py-0">
								<Button
									color="primary"
									type="submit"
									style={{ lineHeight: "1.5" }}
									isLoading={loading}
									startContent={
										loading ? (
											""
										) : (
											<PlusIcon className="h-6" />
										)
									}
								>
									Criar
								</Button>
							</ModalFooter>
						</form>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
