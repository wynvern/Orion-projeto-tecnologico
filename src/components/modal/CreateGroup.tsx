import getFileBase64 from "@/util/getFile";
import {
	AtSymbolIcon,
	CubeIcon,
	PencilIcon,
	PlusIcon,
	TrashIcon,
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
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CreateGroupProps {
	isActive: boolean;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateGroup({
	isActive,
	setIsActive,
}: CreateGroupProps) {
	const [loading, setLoading] = useState(false);
	const [inputNameVal, setInputNameVal] = useState({
		message: "",
		active: false,
	});
	const [inputDescriptionVal, setInputDescriptionVal] = useState({
		message: "",
		active: false,
	});
	const [categoriesVal, setCategoriesVal] = useState({
		message: "",
		active: false,
	});
	const router = useRouter();

	const [inputCategory, setInputCategory] = useState("");
	const [categories, setCategories]: any = useState([]);

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
	}

	async function handleCreateGroup(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setLoading(true);
		const formData = new FormData(e.currentTarget);
		const formDesc: string = formData.get("description") as string;
		const formName: string = formData.get("name") as string;
		const groupName: string = formData.get("groupname") as string; // TODO: have some validation for groupName

		if (
			// TODO: Validate to not permit different characters
			formName === "" ||
			formName.length < 2 ||
			formName.length > 20 ||
			formName.includes(" ")
		) {
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

		if (categories.length < 1) {
			setCategoriesVal({
				message: "Escolha ao menos uma categoria.",
				active: true,
			});
			setLoading(false);
			return false;
		}

		CreateGroup(
			formData.get("name") as string,
			formData.get("description") as string,
			categories,
			groupName
		);
	}

	async function CreateGroup(
		name: string,
		description: string,
		selectedCategories: any,
		grouName: string
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
					grouName,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				router.push(`/g/${data.newGroup.name}`); // TODO: see if this works
			} else {
				const data = await response.json();
				console.log(data);

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

	const [logo, setLogo] = useState({ base64: "", preview: "" });

	async function handleLogoUpload() {
		const data = await getFileBase64(["png"]);

		setLogo(data);
	}

	const [banner, setBanner] = useState({ base64: "", preview: "" });

	async function handleBannerUpload() {
		const data = await getFileBase64(["png"]);

		setBanner(data);
	}

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
							Criar Grupo
						</ModalHeader>
						<form onSubmit={handleCreateGroup}>
							<ModalBody className="py-2 pb-6">
								<div className="w-full relative">
									<div className="h-40 w-40 absolute rounded-xl z-50 hide-button-hover">
										<Image
											className="h-40 w-40 absolute rounded-xl "
											src={
												logo.preview ||
												"/brand/default-group.svg"
											}
											removeWrapper={true}
										></Image>
										<div className="flex gap-x-2 w-full h-full items-center justify-center hidden-button">
											<Button
												onClick={handleLogoUpload}
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
									<div className="w-full h-40 bg-default-100 rounded-xl hide-button-hover">
										<Image
											className="h-40 w-full absolute rounded-xl object-cover"
											src={banner.preview || ""}
											removeWrapper={true}
										></Image>
										<div className="flex gap-x-2 w-full h-full items-center justify-center hidden-button">
											<Button
												onClick={handleBannerUpload}
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
									aria-label="nome"
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
								<Input
									type="text"
									placeholder="Título do Grupo"
									aria-label="nome"
									name="groupname"
									classNames={{ inputWrapper: "h-14" }}
									startContent={
										<UserGroupIcon className="h-6 text-neutral-500" />
									}
								></Input>
								<Autocomplete // TODO: Have same height as the other inputs
									placeholder="Selecione categorias"
									className="dark"
									errorMessage={categoriesVal.message}
									isInvalid={categoriesVal.active}
									startContent={
										<CubeIcon className="h-6 text-neutral-500" />
									}
									onSelectionChange={(e) => {
										setCategoriesVal({
											message: "",
											active: false,
										});
										if (e) handleCategoryInput(e + " ");
									}}
									classNames={{
										base: "dark ",
										clearButton: "dark",
										endContentWrapper: "dark",
										listbox: "dark",
										listboxWrapper: "dark",
										popoverContent: "dark",
										selectorButton: "dark",
									}}
								>
									<AutocompleteItem
										key={"portugues"}
										value={"portugues"}
									>
										Português
									</AutocompleteItem>
									<AutocompleteItem
										key={"matematica"}
										value={"matematica"}
									>
										Matemática
									</AutocompleteItem>
									<AutocompleteItem
										key={"historia"}
										value={"historia"}
									>
										História
									</AutocompleteItem>
									<AutocompleteItem
										key={"geografia"}
										value={"geografia"}
									>
										Geografia
									</AutocompleteItem>
									<AutocompleteItem
										key={"ciencias"}
										value={"ciencias"}
									>
										Ciências
									</AutocompleteItem>
									<AutocompleteItem
										key={"artes"}
										value={"artes"}
									>
										Artes
									</AutocompleteItem>
									<AutocompleteItem
										key={"educacaofisica"}
										value={"educacaofisica"}
									>
										Educação Física
									</AutocompleteItem>
									<AutocompleteItem
										key={"ingles"}
										value={"ingles"}
									>
										Inglês
									</AutocompleteItem>
									<AutocompleteItem
										key={"filosofia"}
										value={"filosofia"}
									>
										Filosofia
									</AutocompleteItem>
									<AutocompleteItem
										key={"sociologia"}
										value={"sociologia"}
									>
										Sociologia
									</AutocompleteItem>
									<AutocompleteItem
										key={"quimica"}
										value={"quimica"}
									>
										Química
									</AutocompleteItem>
									<AutocompleteItem
										key={"fisica"}
										value={"fisica"}
									>
										Física
									</AutocompleteItem>
									<AutocompleteItem
										key={"biologia"}
										value={"biologia"}
									>
										Biologia
									</AutocompleteItem>
									<AutocompleteItem
										key={"informatica"}
										value={"informatica"}
									>
										Informática
									</AutocompleteItem>
									<AutocompleteItem
										key={"espanhol"}
										value={"espanhol"}
									>
										Espanhol
									</AutocompleteItem>
									<AutocompleteItem
										key={"musica"}
										value={"musica"}
									>
										Música
									</AutocompleteItem>
									<AutocompleteItem
										key={"literatura"}
										value={"literatura"}
									>
										Literatura
									</AutocompleteItem>
									<AutocompleteItem
										key={"redacao"}
										value={"redacao"}
									>
										Redação
									</AutocompleteItem>
									<AutocompleteItem
										key={"outros"}
										value={"outros"}
									>
										Outros
									</AutocompleteItem>
									<AutocompleteItem
										key={"informatica"}
										value={"informatica"}
									>
										Informática
									</AutocompleteItem>
									<AutocompleteItem
										key={"eletrotecnica"}
										value={"eletrotecnica"}
									>
										Eletrotécnica
									</AutocompleteItem>
									<AutocompleteItem
										key={"mecanica"}
										value={"mecanica"}
									>
										Mecânica
									</AutocompleteItem>
									<AutocompleteItem
										key={"eletricidade"}
										value={"eletricidade"}
									>
										Eletricidade
									</AutocompleteItem>
									<AutocompleteItem
										key={"eletronica"}
										value={"eletronica"}
									>
										Eletrônica
									</AutocompleteItem>
									<AutocompleteItem
										key={"automacao"}
										value={"automacao"}
									>
										Automação
									</AutocompleteItem>
									<AutocompleteItem
										key={"telecomunicacoes"}
										value={"telecomunicacoes"}
									>
										Telecomunicações
									</AutocompleteItem>
									<AutocompleteItem
										key={"construcaocivil"}
										value={"construcaocivil"}
									>
										Construção Civil
									</AutocompleteItem>
									<AutocompleteItem
										key={"desenhotecnico"}
										value={"desenhotecnico"}
									>
										Desenho Técnico
									</AutocompleteItem>
									<AutocompleteItem
										key={"multimidia"}
										value={"multimidia"}
									>
										Multimídia
									</AutocompleteItem>
									<AutocompleteItem
										key={"contabilidade"}
										value={"contabilidade"}
									>
										Contabilidade
									</AutocompleteItem>
									<AutocompleteItem
										key={"administracao"}
										value={"administracao"}
									>
										Administração
									</AutocompleteItem>
									<AutocompleteItem
										key={"logistica"}
										value={"logistica"}
									>
										Logística
									</AutocompleteItem>
									<AutocompleteItem
										key={"redescomputadores"}
										value={"redescomputadores"}
									>
										Redes de Computadores
									</AutocompleteItem>
									<AutocompleteItem
										key={"manutencaoinformatica"}
										value={"manutencaoinformatica"}
									>
										Manutenção de Informática
									</AutocompleteItem>
									<AutocompleteItem
										key={"desenvolvimento"}
										value={"desenvolvimento"}
									>
										Desenvolvimento de Sistemas
									</AutocompleteItem>
									<AutocompleteItem
										key={"agroindustria"}
										value={"agroindustria"}
									>
										Agroindústria
									</AutocompleteItem>
									<AutocompleteItem
										key={"meioambiente"}
										value={"meioambiente"}
									>
										Meio Ambiente
									</AutocompleteItem>
									<AutocompleteItem
										key={"outros"}
										value={"outros"}
									>
										Outros
									</AutocompleteItem>
								</Autocomplete>
								<div className="flex flex-row gap-x-4 w-full overflow-x-auto">
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
