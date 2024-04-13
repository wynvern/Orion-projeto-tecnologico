import getFileBase64 from "@/util/getFile";
import {
	AtSymbolIcon,
	CubeIcon,
	PencilIcon,
	PhotoIcon,
	PlusIcon,
	UserGroupIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	Image,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
	Autocomplete,
	AutocompleteItem,
	Tooltip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Category {
	label: string;
	value: string;
}

interface CreateGroupProps {
	isActive: boolean;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateGroup({
	isActive,
	setIsActive,
}: CreateGroupProps) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [inputErrors, setInputErrors] = useState({
		name: "",
		groupName: "",
		categories: "",
		description: "",
	});

	const [inputCategory, setInputCategory] = useState("");
	const [categories, setCategories]: any = useState([]);
	const [categoriesServer, setCategoriesServer] = useState([]);
	const [logo, setLogo] = useState({ base64: "", preview: "" });
	const [banner, setBanner] = useState({ base64: "", preview: "" });

	async function fetchCategories() {
		try {
			const response = await fetch("/api/categories");

			if (response.ok) {
				const data = await response.json();
				setCategoriesServer(data);
			}
		} catch (e) {
			console.error(e);
		}
	}

	useEffect(() => {
		fetchCategories();
	}, []);

	function isGroupnameValid(str: string) {
		const regex = /^[a-z._]+$/;
		return regex.test(str);
	}

	function handleCategoryInput(e: string) {
		const inputValue: string = e;
		if (inputValue.includes(" ") && categories.length < 5) {
			const trimmedValue = inputValue.trim();
			if (trimmedValue.length > 0 && !categories.includes(trimmedValue)) {
				setCategories([...categories, trimmedValue]);
				setInputCategory("");
			}
		} else {
			setInputCategory(inputValue);
		}
		if (categories.length == 5) {
			setInputErrors({
				...inputErrors,
				categories: "Somente até 5 categorias podem ser escolhidas.",
			});
			setTimeout(
				() =>
					setInputErrors({
						...inputErrors,
						categories: "",
					}),
				3000
			);
		}
	}

	async function handleCreateGroup(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setLoading(true);
		const formData = new FormData(e.currentTarget);
		const formDesc: string = formData.get("description") as string;
		const formName: string = formData.get("name") as string;
		const groupName: string = formData.get("groupname") as string; // TODO: have some validation for groupName

		if (formName.length == 0) {
			setInputErrors({
				...inputErrors,
				name: "O nome do grupo é obrigatório.",
			});
			setLoading(false);
			return false;
		}

		if (
			!isGroupnameValid(formName) ||
			formName.length < 2 ||
			formName.length > 20
		) {
			setInputErrors({
				...inputErrors,
				name: "O nome do grupo é inválido.",
			});
			setLoading(false);
			return false;
		}

		if (groupName.length == 0) {
			setInputErrors({
				...inputErrors,
				groupName: "O título do grupo é obrigatório.",
			});
			setLoading(false);
			return false;
		}

		if (formDesc.length > 200 || formDesc.length < 1) {
			setInputErrors({
				...inputErrors,
				description: "A descrição do grupo é inválida.",
			});
			setLoading(false);
			return false;
		}

		if (categories.length < 1) {
			setInputErrors({
				...inputErrors,
				categories: "Selecione ao menos uma categoria.",
			});
			setLoading(false);
			return false;
		}

		CreateGroup(formName, formDesc, categories, groupName);
	}

	async function CreateGroup(
		name: string,
		description: string,
		selectedCategories: any,
		groupName: string
	) {
		try {
			const response = await fetch("/api/group", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					description,
					categories: selectedCategories,
					logo: logo.base64,
					banner: banner.base64,
					groupName,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				router.push(`/g/${data.newGroup.name}`); // TODO: see if this works
			} else {
				const data = await response.json();

				if (data.message == "name-already-in-use") {
					setInputErrors({
						...inputErrors,
						name: "O nome do grupo escolhido está em uso.",
					});
				}
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	}

	async function handleLogoUpload() {
		const data = await getFileBase64(["png", "jpg", "jpeg", "webp", "svg"]);
		setLogo(data);
	}

	async function handleBannerUpload() {
		const data = await getFileBase64(["png", "jpg", "jpeg", "webp", "svg"]);
		setBanner(data);
	}

	// TODO: Change icons accordingly
	return (
		<Modal
			size="3xl"
			isOpen={isActive}
			className="py-4 text-foreground"
			onOpenChange={() => {
				setIsActive(false);
			}}
			backdrop="blur"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 pt-1">
							Criar Grupo
						</ModalHeader>
						<form onSubmit={handleCreateGroup}>
							<ModalBody className="py-2 pb-6">
								<div className="w-full relative">
									<div className="h-40 w-40 absolute rounded-xl z-50">
										<Image
											draggable={false}
											src={
												logo.preview ||
												"/brand/default-group.svg"
											}
											removeWrapper={true}
											className="h-40 w-40 object-cover z-50 absolute rounded-xl"
											alt="logo-group"
										/>
										<div className="flex gap-x-2 w-full h-full items-center justify-center">
											<Button
												onClick={handleLogoUpload}
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
											src={banner.preview || ""}
											removeWrapper={true}
											alt="banner-group"
										></Image>
										<div className="flex gap-x-2 w-full h-full pl-40 items-center justify-center">
											<Button
												onClick={handleBannerUpload}
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
									placeholder="Nome"
									aria-label="nome"
									name="name"
									classNames={{ inputWrapper: "h-14" }}
									startContent={
										<AtSymbolIcon className="h-6 text-neutral-500" />
									}
									isInvalid={Boolean(inputErrors.name)}
									errorMessage={inputErrors.name}
									onValueChange={() => {
										setInputErrors({
											...inputErrors,
											name: "",
										});
									}}
								></Input>
								<Input
									type="text"
									placeholder="Título do Grupo"
									aria-label="nome"
									name="groupname"
									classNames={{ inputWrapper: "h-14" }}
									startContent={
										<UserGroupIcon className="h-6 text-neutral-500" />
									}
									isInvalid={Boolean(inputErrors.groupName)}
									errorMessage={inputErrors.groupName}
									onValueChange={() => {
										setInputErrors({
											...inputErrors,
											groupName: "",
										});
									}}
								></Input>
								<Autocomplete // TODO: When cleared it shows error in name
									placeholder="Selecione categorias"
									className="wider-autocomplete"
									startContent={
										<CubeIcon className="h-6 text-neutral-500" />
									}
									isInvalid={Boolean(inputErrors.categories)}
									errorMessage={inputErrors.categories}
									onSelectionChange={(e) => {
										setInputErrors({
											...inputErrors,
											categories: "",
										});
										if (e) handleCategoryInput(e + " ");
									}}
									classNames={{
										base: "text-foreground",
										clearButton: "text-foreground",
										endContentWrapper: "text-foreground",
										listbox: "text-foreground",
										listboxWrapper: "text-foreground",
										popoverContent: "text-foreground",
										selectorButton: "text-foreground",
									}}
								>
									{categoriesServer.map((i: Category) => (
										<AutocompleteItem
											key={i.value}
											value={i.value}
										>
											{i.label}
										</AutocompleteItem>
									))}
								</Autocomplete>
								<div
									className="flex-row gap-x-4 w-full overflow-x-auto"
									style={{
										display:
											categories.length < 1
												? "none"
												: "flex",
									}}
								>
									{categories.map((i: any, index: any) => {
										return (
											<>
												<div
													key={i}
													className="bg-primary p-2 rounded-full"
												>
													<p className="text-sky-300	text-sm flex items-center gap-x-2 pl-2">
														{i}
														<button
															className="bg-primary brightness-50 rounded-full p-[3px]"
															onClick={() => {
																const newCategories =
																	categories;
																newCategories.splice(
																	index,
																	1
																);
																setCategories(
																	newCategories
																);
															}}
														>
															<XMarkIcon className="h-4" />
														</button>
													</p>
												</div>
											</>
										);
									})}
								</div>
								<Textarea
									type="text"
									placeholder="Descrição"
									name="description"
									classNames={{
										input: "py-[2px]",
										inputWrapper: "",
										base: "",
										innerWrapper: "py-2 min-h-20",
									}}
									startContent={
										<PencilIcon className="h-6 text-neutral-500" />
									}
									isInvalid={Boolean(inputErrors.description)}
									errorMessage={inputErrors.description}
									onValueChange={() => {
										setInputErrors({
											...inputErrors,
											description: "",
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
