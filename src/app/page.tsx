"use client";

import CreatePost from "@/components/modal/CreatePost";
import { Button } from "@nextui-org/react";
import { SetStateAction, useState } from "react";

export default function Home() {
	const [createPostModal, setCreatePostModal] = useState(false);

	return (
		<div>
			<img src={""} alt="" />
			<p>Hello World, nothing here</p>
			<Button
				onClick={() => {
					setCreatePostModal(!createPostModal);
				}}
			>
				Criar
			</Button>

			<CreatePost
				isActive={createPostModal}
				setIsActive={setCreatePostModal}
			/>
		</div>
	);
}
