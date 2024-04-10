import getFileBase64 from "@/util/getFile";
import {
	CheckIcon,
	PaperAirplaneIcon,
	PencilIcon,
	PencilSquareIcon,
	PhotoIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Image,
	Textarea,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface ReportUserProps {
	isActive: boolean;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
	profile: any;
}

export default function ReportUser({
	isActive,
	setIsActive,
	profile,
}: ReportUserProps) {
	const [loading, setLoading] = useState(false);
	const [inputNameVal, setInputNameVal] = useState({
		message: "",
		active: false,
	});
	const [inputBioVal, setInputBioVal] = useState({
		message: "",
		active: false,
	});
	const [success, setSuccess] = useState(false);

	async function handleReportUser(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setLoading(true);
		const formData = new FormData(e.currentTarget);
		const formTitle: string = formData.get("title") as string;
		const formContent: string = formData.get("content") as string;

		if (formTitle.length > 100) {
			setInputNameVal({
				message: "Título muito grande.",
				active: true,
			});
			setLoading(false);
			return false;
		}

		if (formTitle.length < 1) {
			setInputNameVal({
				message: "O título é obrigatório.",
				active: true,
			});
			setLoading(false);
			return false;
		}

		if (formContent.length > 500) {
			setInputBioVal({ message: "Conteúdo muito grande.", active: true });
			setLoading(false);
			return false;
		}

		if (formContent.length < 1) {
			setInputBioVal({
				message: "O conteúdo é obrigatório.",
				active: true,
			});
			setLoading(false);
			return false;
		}

		await ReportUser(formTitle, formContent);
		setLoading(false);
	}

	async function ReportUser(title: string, content: string) {
		try {
			const response = await fetch(`/api/user/${profile.id}/report`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title,
					content,
				}),
			});

			if (response.ok) {
				setSuccess(true);
				setTimeout(() => setSuccess(false), 3000);
			} else {
				const data = await response.json();

				if (data.message == "user-already-reported") {
					alert("Usuário já foi reportado"); // TODO: use better log, like a popup
				}
			}
		} catch (e) {
			console.error(e);
		}
	}

	return (
		<Modal
			size="3xl"
			isOpen={isActive}
			className="dark py-4"
			onOpenChange={() => {
				setIsActive(false);
			}}
			backdrop="blur"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 pt-1">
							Reportar Perfil
						</ModalHeader>
						<form onSubmit={handleReportUser}>
							<ModalBody className="py-2 pb-6">
								<Input
									type="text"
									placeholder="Título"
									name="title"
									classNames={{ inputWrapper: "h-14" }}
									startContent={
										<PencilIcon className="h-6 text-neutral-500" />
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
									placeholder="Descrição da denúncia"
									name="content"
									classNames={{
										innerWrapper: "py-2 min-h-20",
									}}
									startContent={
										<PencilIcon className="h-6 text-neutral-500" />
									}
									isInvalid={inputBioVal.active}
									errorMessage={inputBioVal.message}
									onValueChange={() => {
										setInputBioVal({
											message: "",
											active: false,
										});
									}}
								></Textarea>
							</ModalBody>
							<ModalFooter className="flex justify-between py-0">
								<Button
									color={success ? "success" : "primary"}
									type="submit"
									style={{ lineHeight: "1.5" }}
									isLoading={loading}
									startContent={
										loading ? (
											""
										) : success ? (
											<CheckIcon className="h-6" />
										) : (
											<PaperAirplaneIcon className="h-6" />
										)
									}
								>
									Enviar
								</Button>
							</ModalFooter>
						</form>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
