"use client";

import { Button, Input } from "@nextui-org/react";

export default function Finish() {
	function handleFinish() {}

	return (
		<div className="flex w-full h-full items-center justify-center">
			<div className="flex flex-col gap-y-6 w-[400px]">
				<h1>Conclua sua Conta</h1>
				<form className="gap-y-6 flex flex-col" onSubmit={handleFinish}>
					<Input
						label="Nome de usuário"
						type="text"
						name="name"
					></Input>

					<Button type="submit" color="primary">
						Confirmar
					</Button>
				</form>
			</div>
		</div>
	);
}
