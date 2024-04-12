import getFileBase64 from "@/util/getFile";
import {
	ChatBubbleBottomCenterTextIcon,
	DocumentIcon,
	PencilIcon,
	PhotoIcon,
	PlusIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import {
	Button,
	Chip,
	Image,
	Input,
	Link,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ScrollShadow,
	Tab,
	Tabs,
	Textarea,
} from "@nextui-org/react";
import { useState } from "react";
import { TRANSITION_EASINGS } from "@nextui-org/framer-transitions";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";

interface CreatePostProps {
	isActive: boolean;
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
	group: any;
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

	async function imageFileToDict(
		file: File
	): Promise<{ base64: string; preview: string }> {
		return new Promise((resolve, reject) => {
			if (!file.type.match("image.*")) {
				reject(new Error("File is not an image"));
				return;
			}

			const reader = new FileReader();

			reader.onload = (event: ProgressEvent<FileReader>) => {
				if (event.target?.result instanceof ArrayBuffer) {
					const base64 = Buffer.from(event.target.result).toString(
						"base64"
					);
					const preview = URL.createObjectURL(file);

					const imageDict: { base64: string; preview: string } = {
						base64: base64,
						preview: preview,
					};

					resolve(imageDict);
				}
			};

			reader.onerror = function (error: ProgressEvent<FileReader>) {
				reject(error);
			};

			reader.readAsArrayBuffer(file);
		});
	}

	async function postCreatePost(title: string, content: string) {
		try {
			const mediaToPost = media.map((i) => i.base64);

			await fetch(`/api/group/${group.id}/post`, {
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

	const [dragging, setDragging] = useState(false);

	const handleDragOver = (e: any) => {
		e.preventDefault();
		setDragging(true);
	};

	const handleDragLeave = () => {
		setDragging(false);
	};

	const handleDrop = async (e: any) => {
		e.preventDefault();
		setDragging(false);

		const files: any = Array.from(e.dataTransfer.files);

		if (!files[0]) {
			return false;
		}

		if (
			!["jpeg", "jpg", "png", "webp"].includes(
				files[0].type.split("/")[1]
			)
		) {
			console.error("tipo não suportado"); // TODO: Better drag notifications
		}
		if (media.length >= 5) return false;

		const newMediaFile = await imageFileToDict(files[0]);
		const newMedia: Media[] = [...media, newMediaFile];
		setMedia(newMedia);
	};

	// TODO: Drafts
	return (
		<Modal
			size="3xl"
			isOpen={isActive}
			className="dark py-4"
			onOpenChange={() => {
				setIsActive(false);
			}}
			backdrop="blur"
			motionProps={{
				variants: {
					enter: {
						scale: 1,
						y: "var(--slide-enter)",
						opacity: 1,
						transition: {
							scale: {
								duration: 0.4,
								ease: TRANSITION_EASINGS.ease,
							},
							opacity: {
								duration: 0.4,
								ease: TRANSITION_EASINGS.ease,
							},
							y: {
								type: "spring",
								bounce: 0,
								duration: 0.6,
							},
						},
					},
					exit: {
						scale: 1.1, // NextUI default 1.03
						y: "var(--slide-exit)",
						opacity: 0,
						transition: {
							duration: 0.3,
							ease: TRANSITION_EASINGS.ease,
						},
					},
				},
			}}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="gap-x-4 flex gap-1 pt-1">
							<div className="flex gap-x-2">
								<p>Criar Post em</p>
								<Chip
									className="pl-[2px] flex justify-center"
									startContent={
										<Image
											src={group.logo}
											removeWrapper={true}
											className="h-6 w-6 object-cover mr-[2px]"
										/>
									}
								>
									@{group.name}
								</Chip>
							</div>
						</ModalHeader>
						<form onSubmit={createPost}>
							<ModalBody className="py-2 pb-4 min-h-[400px]">
								<Tabs
									aria-label="Options"
									selectedKey={selected}
									onSelectionChange={(key: any) =>
										setSelected(key)
									}
									classNames={{ tabList: "w-full" }}
									color="primary"
									disableAnimation={false}
								>
									<Tab
										key="post"
										title={
											<div className="flex items-center space-x-2">
												<ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
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
													<PencilIcon className="h-6 text-neutral-500" />
												}
												maxLength={100}
											></Input>
											<Textarea
												size="lg"
												name="content"
												placeholder="Digite aqui"
												classNames={{
													innerWrapper:
														"py-2 min-h-60",
												}}
												startContent={
													<PencilIcon className="h-6 text-neutral-500" />
												}
												maxLength={1500}
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
											<ScrollShadow className="flex flex-col w-full relative">
												{/* Upload image */}
												<div
													className={`w-full h-40 rounded-large drop-zone transition-colors duration-200 ${
														dragging
															? "bg-primary"
															: "bg-default-100 "
													}`}
													onDragOver={handleDragOver}
													onDragLeave={
														handleDragLeave
													}
													onDrop={handleDrop}
												>
													<div className="h-full w-full flex items-center justify-center">
														<div className="flex items-center flex-col gap-y-2 my-10">
															<CloudArrowUpIcon className="h-20 w-20" />
															<p>
																Arraste ou{" "}
																<Link
																	onClick={
																		handleSelectMedia
																	}
																	className="text-white"
																>
																	<b>
																		clique
																		aqui
																	</b>
																</Link>{" "}
																para adicionar
																mídia.
															</p>
														</div>
													</div>
												</div>
												<div className="flex flex-col gap-y-3 my-3">
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
																	className="h-16 w-16 object-cover"
																	alt="item-post"
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
											</ScrollShadow>
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
							<ModalFooter className="flex justify-between py-0">
								<Button
									color="primary"
									type="submit"
									style={{ lineHeight: "1.5" }}
									isLoading={loading}
									startContent={<PlusIcon className="h-6" />}
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
