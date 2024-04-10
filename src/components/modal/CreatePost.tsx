import getFileBase64 from "@/util/getFile";
import {
	AtSymbolIcon,
	Bars3BottomLeftIcon,
	CloudArrowUpIcon,
	DocumentIcon,
	PhotoIcon,
	PlusIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import {
	Button,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Tab,
	Tabs,
	Textarea,
} from "@nextui-org/react";
import { Key, useState } from "react";

interface CreatePostProps {
	isActive: boolean;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
	group: any;
}

interface FileBase64Info {
	base64: string;
	preview: string;
}

interface Media {
	base64: string;
	preview: string;
}

type TabKey = "post" | "media" | "documents";

export default function CreatePost({
	isActive,
	setIsActive,
	group,
}: CreatePostProps) {
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<TabKey>("post");
	const [media, setMedia] = useState<Media[]>([]);

	async function createPost(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setLoading(true);
		const formData = new FormData(e.currentTarget);
		const formTitle: string = formData.get("title") as string;
		const formDescription: string = formData.get("content") as string;

		postCreatePost(formTitle, formDescription);
	}

	async function postCreatePost(title: string, content: string) {
		try {
			const mediaToPost = media.map((i) => i.base64);

			const response = await fetch(`/api/group/${group.id}/post`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title,
					content,
					images: mediaToPost,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				console.log(data);
			} else {
				const data = await response.json();
				console.log(data);
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	}

	async function handleSelectMedia() {
		try {
			const file = await getFileBase64(["png", "jpg", "jpeg"]);

			const newMedia: Media[] = [...media, file];

			setMedia(newMedia);
		} catch (error) {
			console.error("Error while selecting media:", error);
		}
	}

	return (
		<Modal
			size="3xl"
			isOpen={isActive}
			className="dark py-4 h-[600px]"
			onOpenChange={() => {
				setIsActive(false);
			}}
			backdrop="blur"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 pt-1">
							Criar Post em @{group.name}
						</ModalHeader>
						<form onSubmit={createPost}>
							<ModalBody className="py-6">
								<Tabs
									aria-label="Options"
									selectedKey={selected}
									onSelectionChange={(key: any) =>
										setSelected(key)
									}
									classNames={{ tabList: "w-full" }}
								>
									<Tab
										key="post"
										title={
											<div className="flex items-center space-x-2">
												<Bars3BottomLeftIcon className="h-6 w-6" />
												<span>Post</span>
											</div>
										}
										className="px-0 py-0"
									>
										<div className="gap-y-3 flex flex-col">
											<Input
												name="title"
												placeholder="Título"
												classNames={{
													inputWrapper: "h-14",
												}}
												startContent={
													<AtSymbolIcon className="h-6 text-neutral-500" />
												}
											></Input>
											<Textarea
												size="lg"
												name="content"
												placeholder="Digite aqui"
												classNames={{
													innerWrapper:
														"py-2 min-h-60",
													input: "py-1",
												}}
											/>
										</div>
									</Tab>
									<Tab
										key="media"
										className="px-0 py-0"
										title={
											<div className="flex items-center space-x-2">
												<PhotoIcon className="h-6 w-6" />
												<span>Mídia</span>
											</div>
										}
									>
										<div className="flex h-80 w-full overflow-y-auto">
											<div className="flex flex-col w-full">
												<Button
													startContent={
														<PlusIcon className="h-6" />
													}
													variant="bordered"
													onClick={handleSelectMedia}
												>
													Adicionar
												</Button>
												<p className="text-default-200 text-center w-full pt-2 pb-3">
													Faça upload de fotos e
													vídeos do seu computador.
												</p>
												<div className="flex flex-col gap-y-3">
													{media.map((item, _) => (
														<div
															key={_}
															className="w-full bg-default-100 relative rounded-large flex justify-between items-center bg-cover bg-center"
															style={{
																backgroundImage: `url(${item.preview})`,
															}}
														>
															<div
																className="fixed w-full h-full absolute rounded-large bg-black bg-opacity-60"
																style={{
																	backdropFilter:
																		"blur(10px)",
																}}
															></div>
															<div className="p-1">
																<Image
																	src={
																		item.preview
																	}
																	className="h-16 w-16"
																/>
															</div>
															<div>
																<Button
																	className="rounded-full p-2 mr-4"
																	size="sm"
																	isIconOnly={
																		true
																	}
																	onClick={() => {
																		const newMedia =
																			[
																				...media,
																			]; // Create a copy of the media array
																		newMedia.splice(
																			_,
																			1
																		); // Remove the item at the specified index
																		setMedia(
																			newMedia
																		); // Update the state with the new array
																	}}
																>
																	<XMarkIcon className="h-6" />
																</Button>
															</div>
														</div>
													))}
												</div>
											</div>
										</div>
									</Tab>
									<Tab
										key="documents"
										title={
											<div className="flex items-center space-x-2">
												<DocumentIcon className="h-6 w-6" />
												<span>Documentos</span>
											</div>
										}
									>
										Aqui ficam documentos
									</Tab>
								</Tabs>
							</ModalBody>
							<ModalFooter className="flex justify-between">
								<Button
									color="primary"
									type="submit"
									style={{ lineHeight: "1.5" }}
									isLoading={loading}
								>
									Criar
									<PlusIcon className="h-1/2" />
								</Button>
							</ModalFooter>
						</form>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
