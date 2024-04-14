import request from "@/util/api";
import getFileBase64 from "@/util/getFile";
import {
	CheckIcon,
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
import { useState } from "react";

interface CustomizeGroupProps {
	isActive: boolean;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
	group: any;
	updateGroup: () => void;
}

export default function CustomizeGroup({
	isActive,
	setIsActive,
	group,
	updateGroup,
}: CustomizeGroupProps) {
	const [loading, setLoading] = useState(false);
	const [inputNameVal, setInputNameVal] = useState({
		message: "",
		active: false,
	});
	const [inputdescriptionVal, setInputdescriptionVal] = useState({
		message: "",
		active: false,
	});
	const [banner, setBanner] = useState({ base64: "", preview: "" });
	const [logo, setlogo] = useState({ base64: "", preview: "" });
	const [success, setSuccess] = useState(false);

	async function handleCustomizeGroup(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setLoading(true);
		const formData = new FormData(e.currentTarget);
		const formName: string = formData.get("name") as string;
		const formdescription: string = formData.get("description") as string;

		if (formName.length > 30) {
			setInputNameVal({
				message: "Nome do grupo muito grande",
				active: true,
			});
			setLoading(false);
			return false;
		}

		if (formdescription.length < 1 || formdescription.length > 200) {
			setInputdescriptionVal({
				message: "Nome do grupo inválido",
				active: true,
			});
			setLoading(false);
			return false;
		}

		await CustomizeGroup(formName, formdescription);
		await updatelogo();
		await updateBanner();
		setLoading(false);
		setSuccess(true);
		setTimeout(() => setSuccess(false), 3000);
		setTimeout(() => {
			updateGroup();
			setIsActive(false);
		}, 1000);
	}

	async function CustomizeGroup(name: string, description: string) {
		await request(
			`/api/group/${group.id}`,
			"PATCH",
			{},
			{ groupName: name, description: description }
		);
	}

	async function triggerlogoUpdate() {
		const file = await getFileBase64(["png", "jpg", "jpeg", "webp", "svg"]);
		if (file) setlogo(file);
	}

	async function updatelogo() {
		if (!logo.base64) return;
		await request(
			`/api/group/${group.id}/logo`,
			"PATCH",
			{},
			{ logo: logo.base64 }
		);
	}

	async function triggerBannerUpdate() {
		const file = await getFileBase64(["png", "jpg", "jpeg", "webp", "svg"]);
		if (file) setBanner(file);
	}

	async function updateBanner() {
		if (!banner.base64) return;
		await request(
			`/api/group/${group.id}/banner`,
			"PATCH",
			{},
			{ banner: banner.base64 }
		);
	}

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
							Personalizar Grupo
						</ModalHeader>
						<form onSubmit={handleCustomizeGroup}>
							<ModalBody className="py-2 pb-6">
								<div className="w-full relative">
									<div className="h-40 w-40 absolute rounded-xl z-50">
										<Image
											draggable={false}
											src={
												logo.preview ||
												group.logo ||
												"/brand/default-group.svg"
											}
											removeWrapper={true}
											className="h-40 w-40 object-cover z-50 absolute rounded-xl"
											alt="logo-group"
										/>
										<div className="flex gap-x-2 w-full h-full items-center justify-center">
											<Button
												onClick={triggerlogoUpdate}
												className="flex z-50 opacity-70"
												isIconOnly={true}
												isDisabled={loading}
											>
												<PhotoIcon className="h-6" />
											</Button>
										</div>
									</div>
									<div className="w-full h-40 bg-default-100 rounded-xl">
										<Image
											className="h-40 w-full absolute rounded-xl pl-[9rem] object-cover"
											src={banner.preview || group.banner}
											removeWrapper={true}
											alt="banner-group"
										></Image>
										<div className="flex gap-x-2 w-full h-full pl-40 items-center justify-center">
											<Button
												onClick={triggerBannerUpdate}
												className="flex z-10 opacity-70"
												isIconOnly={true}
												isDisabled={loading}
											>
												<PhotoIcon className="h-6" />
											</Button>
										</div>
									</div>
								</div>
								<Input
									type="text"
									placeholder="Nome Completo"
									name="name"
									isDisabled={loading}
									classNames={{ inputWrapper: "h-14" }}
									startContent={
										<UserIcon className="h-6 text-neutral-500" />
									}
									isInvalid={inputNameVal.active}
									errorMessage={inputNameVal.message}
									onValueChange={() => {
										setInputNameVal({
											message: "",
											active: false,
										});
									}}
									defaultValue={group.groupName}
								></Input>
								<Textarea
									type="text"
									placeholder="Descrição do Grupo"
									name="description"
									isDisabled={loading}
									classNames={{
										innerWrapper: "py-2 min-h-20",
									}}
									startContent={
										<PencilIcon className="h-6 text-neutral-500" />
									}
									isInvalid={inputdescriptionVal.active}
									errorMessage={inputdescriptionVal.message}
									onValueChange={() => {
										setInputdescriptionVal({
											message: "",
											active: false,
										});
									}}
									defaultValue={group.description}
								></Textarea>
							</ModalBody>
							<ModalFooter className="py-0">
								<Button
									color={success ? "success" : "primary"}
									type="submit"
									style={{ lineHeight: "1.5" }}
									isLoading={loading}
									isDisabled={loading}
									startContent={
										loading ? (
											""
										) : success ? (
											<CheckIcon className="h-6" />
										) : (
											<PencilSquareIcon className="h-6" />
										)
									}
								>
									Atualizar
								</Button>
							</ModalFooter>
						</form>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
