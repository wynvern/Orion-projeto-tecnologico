import {
	AtSymbolIcon,
	PencilIcon,
	PencilSquareIcon,
	PlusIcon,
	TrashIcon,
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

interface CustomizeProfileProps {
	isActive: boolean;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
	profile: any;
}

export default function CustomizeProfile({
	isActive,
	setIsActive,
	profile,
}: CustomizeProfileProps) {
	const [loading, setLoading] = useState(false);
	const [inputNameVal, setInputNameVal] = useState({
		message: "",
		active: false,
	});
	const [inputBioVal, setInputBioVal] = useState({
		message: "",
		active: false,
	});
	const session = useSession();
	const { update } = useSession();

	async function handleCustomizeProfile(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setLoading(true);
		const formData = new FormData(e.currentTarget);
		const formName: string = formData.get("name") as string;
		const formBio: string = formData.get("bio") as string;

		if (formName.length > 30) {
			setInputNameVal({
				message: "Nome de usuário não aceito.",
				active: true,
			});
			setLoading(false);
			return false;
		}

		CustomizeProfile(formName, formBio);
		updateAvatar();
		updateBanner();
	}

	async function CustomizeProfile(name: string, bio: string) {
		try {
			const response = await fetch("/api/user", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					bio: bio,
				}),
			});

			if (response.ok) {
				const data = await response.json();
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	}

	// TODO: TAG:Important use new function and remove all this repetitive code
	// Image Avatar Handling

	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(
		null
	);

	function triggerAvatarUpdate() {
		if (fileInputRef) {
			fileInputRef.click();
		}
	}

	async function updateAvatar() {
		if (!avatarFile) return;
		setLoading(true);
		const base64 = await convertToBase64(avatarFile);
		try {
			const response = await fetch("/api/user/avatar", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ avatar: base64 }),
			});
			if (response.ok) {
				const data = await response.json();
				update({ image: data.url });
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	}

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			setAvatarFile(file);
			setAvatarPreview(URL.createObjectURL(file));
		}
	};

	const convertToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			fileReader.onload = () => {
				resolve((fileReader.result as string).split(",")[1]);
			};
			fileReader.onerror = (error) => {
				reject(error);
			};
		});
	};

	// Banner Image Handling

	const [bannerPreview, setBannerPreview] = useState<string | null>(null);
	const [bannerFile, setBannerFile] = useState<File | null>(null);
	const [bannerInputRef, setBannerInputRef] =
		useState<HTMLInputElement | null>(null);

	function triggerBannerUpdate() {
		if (bannerInputRef) {
			bannerInputRef.click();
		}
	}

	async function updateBanner() {
		if (!bannerFile) return;
		setLoading(true);
		const base64 = await convertToBase64(bannerFile);
		try {
			const response = await fetch("/api/user/banner", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ banner: base64 }),
			});
			if (response.ok) {
				const data = await response.json();
				update({ banner: data.url });
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	}

	const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			setBannerFile(file);
			setBannerPreview(URL.createObjectURL(file));
		}
	};

	return (
		<Modal
			size="3xl"
			isOpen={isActive}
			className="dark py-4"
			onOpenChange={() => {
				setIsActive(false);
			}}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 pt-1">
							Personalizar Perfil
						</ModalHeader>
						<form onSubmit={handleCustomizeProfile}>
							<ModalBody className="py-2 pb-6">
								<div className="w-full relative">
									<div className="h-40 w-40 absolute rounded-xl z-50 hide-button-hover">
										<Image
											className="h-40 w-40 absolute rounded-xl "
											src={
												avatarPreview ||
												session.data?.user.image ||
												"/brand/default-user.svg"
											}
											removeWrapper={true}
										></Image>
										<div className="flex gap-x-2 w-full h-full items-center justify-center hidden-button">
											<Button
												onClick={triggerAvatarUpdate}
												className="flex z-10"
												isIconOnly={true}
												color="primary"
											>
												<PlusIcon className="h-6" />
											</Button>
											<Button
												className="flex z-10"
												isIconOnly={true}
											>
												<TrashIcon className="h-6" />
											</Button>
										</div>
									</div>
									<div className="w-full h-40 bg-default-100 rounded-xl  hide-button-hover">
										<Image
											className="h-40 w-full absolute rounded-xl object-cover"
											src={
												bannerPreview ||
												session.data?.user.banner
											}
											removeWrapper={true}
										></Image>
										<div className="flex gap-x-2 w-full h-full items-center justify-center hidden-button">
											<Button
												onClick={triggerBannerUpdate}
												className="flex z-10"
												isIconOnly={true}
												color="primary"
											>
												<PlusIcon className="h-6" />
											</Button>
											<Button
												className="flex z-10"
												isIconOnly={true}
											>
												<TrashIcon className="h-6" />
											</Button>
										</div>
									</div>
								</div>
								<Input
									type="text"
									placeholder="Nome Completo"
									name="name"
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
									defaultValue={profile.name}
								></Input>
								<Textarea
									type="text"
									placeholder="Biografia"
									name="bio"
									classNames={{
										innerWrapper: "py-2",
										input: "py-1",
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
									defaultValue={profile.bio}
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
											<PencilSquareIcon className="h-6" />
										)
									}
								>
									Salvar
								</Button>{" "}
							</ModalFooter>{" "}
						</form>
					</>
				)}
			</ModalContent>

			<input
				id="avatar-upload"
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleAvatarChange}
				ref={(ref) => setFileInputRef(ref)}
			/>
			<input
				id="avatar-upload"
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleBannerChange}
				ref={(ref) => setBannerInputRef(ref)}
			/>
		</Modal>
	);
}
