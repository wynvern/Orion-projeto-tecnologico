"use client";

import CreateGroup from "@/components/modal/CreateGroup";
import { Button } from "@nextui-org/react";
import { useState } from "react";

export default function Groups() {
	const [groupModal, setGroupModal] = useState(false);

	return (
		<div>
			<Button
				onClick={() => {
					setGroupModal(!groupModal);
				}}
			>
				Criar Grupo
			</Button>

			<CreateGroup isActive={groupModal} setIsActive={setGroupModal} />
		</div>
	);
}
