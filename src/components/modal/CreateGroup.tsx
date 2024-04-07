import {
	AtSymbolIcon,
	PencilIcon,
	PlusIcon,
	TrashIcon,
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

	const [inputCategory, setInputCategory] = useState("");
	const [categories, setCategories] = useState([]);

	function handleCategoryInput(e: string) {
		const inputValue: string = e;
		if (inputValue.includes(" ") && categories.length < 5) {
			const trimmedValue = inputValue.trim();
			if (trimmedValue.length > 0) {
				setCategories([...categories, trimmedValue]);
				setInputCategory("");
			}
		} else {
			setInputCategory(inputValue);
		}
	}

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
		// Upload the avatar itself to the POST
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
		// Upload image banner to POST
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
								<div className="w-full relative">
									<div className="h-40 w-40 absolute rounded-xl z-50 hide-button-hover">
										<Image
											className="h-40 w-40 absolute rounded-xl "
											src={avatarPreview || ""}
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
											src={bannerPreview || ""}
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
								<Autocomplete
									label="Selecione categorias"
									className="dark"
									onInputChange={(e) => {
										handleCategoryInput(e + " ");
									}}
									classNames={{
										base: "dark",
										clearButton: "dark",
										endContentWrapper: "dark",
										listbox: "dark",
										listboxWrapper: "dark",
										popoverContent: "dark",
										selectorButton: "dark",
									}}
								>
									<AutocompleteItem
										key={1}
										value={"portugues"}
									>
										Português
									</AutocompleteItem>
									<AutocompleteItem
										key={2}
										value={"matematica"}
									>
										Matemática
									</AutocompleteItem>
									<AutocompleteItem
										key={3}
										value={"historia"}
									>
										História
									</AutocompleteItem>
									<AutocompleteItem
										key={4}
										value={"geografia"}
									>
										Geografia
									</AutocompleteItem>
									<AutocompleteItem
										key={5}
										value={"ciencias"}
									>
										Ciências
									</AutocompleteItem>
									<AutocompleteItem key={6} value={"artes"}>
										Artes
									</AutocompleteItem>
									<AutocompleteItem
										key={7}
										value={"educacaofisica"}
									>
										Educação Física
									</AutocompleteItem>
									<AutocompleteItem key={8} value={"ingles"}>
										Inglês
									</AutocompleteItem>
									<AutocompleteItem
										key={9}
										value={"filosofia"}
									>
										Filosofia
									</AutocompleteItem>
									<AutocompleteItem
										key={10}
										value={"sociologia"}
									>
										Sociologia
									</AutocompleteItem>
									<AutocompleteItem
										key={11}
										value={"quimica"}
									>
										Química
									</AutocompleteItem>
									<AutocompleteItem key={12} value={"fisica"}>
										Física
									</AutocompleteItem>
									<AutocompleteItem
										key={13}
										value={"biologia"}
									>
										Biologia
									</AutocompleteItem>
									<AutocompleteItem
										key={14}
										value={"informatica"}
									>
										Informática
									</AutocompleteItem>
									<AutocompleteItem
										key={15}
										value={"espanhol"}
									>
										Espanhol
									</AutocompleteItem>
									<AutocompleteItem key={16} value={"musica"}>
										Música
									</AutocompleteItem>
									<AutocompleteItem
										key={17}
										value={"literatura"}
									>
										Literatura
									</AutocompleteItem>
									<AutocompleteItem
										key={18}
										value={"redacao"}
									>
										Redação
									</AutocompleteItem>
									<AutocompleteItem key={19} value={"outros"}>
										Outros
									</AutocompleteItem>
									<AutocompleteItem
										key={20}
										value={"informatica"}
									>
										Informática
									</AutocompleteItem>
									<AutocompleteItem
										key={21}
										value={"eletrotecnica"}
									>
										Eletrotécnica
									</AutocompleteItem>
									<AutocompleteItem
										key={22}
										value={"mecanica"}
									>
										Mecânica
									</AutocompleteItem>
									<AutocompleteItem
										key={23}
										value={"eletricidade"}
									>
										Eletricidade
									</AutocompleteItem>
									<AutocompleteItem
										key={24}
										value={"eletronica"}
									>
										Eletrônica
									</AutocompleteItem>
									<AutocompleteItem
										key={25}
										value={"automacao"}
									>
										Automação
									</AutocompleteItem>
									<AutocompleteItem
										key={26}
										value={"telecomunicacoes"}
									>
										Telecomunicações
									</AutocompleteItem>
									<AutocompleteItem
										key={27}
										value={"construcaocivil"}
									>
										Construção Civil
									</AutocompleteItem>
									<AutocompleteItem
										key={28}
										value={"desenhotecnico"}
									>
										Desenho Técnico
									</AutocompleteItem>
									<AutocompleteItem
										key={29}
										value={"multimidia"}
									>
										Multimídia
									</AutocompleteItem>
									<AutocompleteItem
										key={30}
										value={"contabilidade"}
									>
										Contabilidade
									</AutocompleteItem>
									<AutocompleteItem
										key={31}
										value={"administracao"}
									>
										Administração
									</AutocompleteItem>
									<AutocompleteItem
										key={32}
										value={"logistica"}
									>
										Logística
									</AutocompleteItem>
									<AutocompleteItem
										key={33}
										value={"redescomputadores"}
									>
										Redes de Computadores
									</AutocompleteItem>
									<AutocompleteItem
										key={34}
										value={"manutencaoinformatica"}
									>
										Manutenção de Informática
									</AutocompleteItem>
									<AutocompleteItem
										key={35}
										value={"desenvolvimento"}
									>
										Desenvolvimento de Sistemas
									</AutocompleteItem>
									<AutocompleteItem
										key={36}
										value={"agroindustria"}
									>
										Agroindústria
									</AutocompleteItem>
									<AutocompleteItem
										key={37}
										value={"meioambiente"}
									>
										Meio Ambiente
									</AutocompleteItem>
									<AutocompleteItem key={38} value={"outros"}>
										Outros
									</AutocompleteItem>
								</Autocomplete>
								<div className="flex flex-row gap-x-4">
									{categories.map((i, index) => {
										return (
											<>
												<div
													key={i}
													className="bg-primary p-2 rounded-full"
												>
													<p className="text-sky-300	text-sm flex items-center gap-x-2 pl-2">
														{i}
														<button
															className="bg-sky-800 rounded-full p-[3px]"
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
