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
	Tooltip,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
	const [banner, setBanner] = useState({ base64: "", preview: "" });
	const [avatar, setAvatar] = useState({ base64: "", preview: "" });
	const [success, setSuccess] = useState(false);
	const router = useRouter();

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

		await CustomizeProfile(formName, formBio);
		await updateAvatar();
		await updateBanner();
		setLoading(false);
		setSuccess(true);
		setTimeout(() => setSuccess(false), 3000);
		router.replace(
			`/u/${session.data?.user.username}?date=${new Date().getTime()}`
		);
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
				// TODO: Make a success and reload page
			}
		} catch (e) {
			console.error(e);
		}
	}

	async function triggerAvatarUpdate() {
		const file = await getFileBase64(["png", "jpg", "jpeg", "webp", "svg"]);
		if (file) setAvatar(file);
	}

	async function updateAvatar() {
		if (!avatar.base64) return;

		try {
			const response = await fetch("/api/user/avatar", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ avatar: avatar.base64 }),
			});
			if (response.ok) {
				const data = await response.json();
				update({ image: data.url });
			}
		} catch (e) {
			console.error(e);
		}
	}

	async function triggerBannerUpdate() {
		const file = await getFileBase64(["png", "jpg", "jpeg", "webp", "svg"]);
		if (file) setBanner(file);
	}

	async function updateBanner() {
		if (!banner.base64) return;

		try {
			const response = await fetch("/api/user/banner", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ banner: banner.base64 }),
			});
			if (response.ok) {
				const data = await response.json();
				update({ banner: data.url });
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
							Personalizar Perfil
						</ModalHeader>
						<form onSubmit={handleCustomizeProfile}>
							<ModalBody className="py-2 pb-6">
								<div className="w-full relative">
									<div className="h-40 w-40 absolute rounded-xl z-50">
										<Image
											draggable={false}
											src={
												avatar.preview ||
												session.data?.user.image ||
												"/brand/default-user.svg"
											}
											removeWrapper={true}
											className="h-40 w-40 object-cover z-50 absolute rounded-xl"
											alt="avatar-user"
										/>
										<div className="flex gap-x-2 w-full h-full items-center justify-center">
											<Button
												onClick={triggerAvatarUpdate}
												className="flex z-50 opacity-70"
												isIconOnly={true}
											>
												<PhotoIcon className="h-6" />
											</Button>
										</div>
									</div>
									<div className="w-full h-40 bg-default-100 rounded-xl">
										<Image
											className="h-40 w-full absolute rounded-xl pl-[9rem] object-cover"
											src={
												banner.preview ||
												session.data?.user.banner
											}
											removeWrapper={true}
											alt="banner-user"
										></Image>
										<div className="flex gap-x-2 w-full h-full pl-40 items-center justify-center">
											<Button
												onClick={triggerBannerUpdate}
												className="flex z-10 opacity-70"
												isIconOnly={true}
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
									defaultValue={profile.bio}
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
											<PencilSquareIcon className="h-6" />
										)
									}
								>
									Salvar
								</Button>
							</ModalFooter>
						</form>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
