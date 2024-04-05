"use client";

import { Button, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Finish() {
	const { update } = useSession();
	const router = useRouter();
	const [inputValidation, setInputValidation] = useState({
		message: "Erro desconhecido.",
		validated: false,
	});

	async function handleFinish(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		handleFinishPost(formData.get("name") as string);
	}

	async function handleFinishPost(name: string) {
		try {
			const response = await fetch("/api/user/finish", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: name,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				update({ username: data.newName });

				router.push("/");
			} else {
				const data = await response.json(); // Something?
				console.log(data.type);
			}
		} catch (e: any) {
			console.error("Error:", e.message);
		}
	}

	return (
		<div className="flex w-full h-full items-center justify-center">
			<div className="flex flex-col gap-y-6 w-[400px]">
				<h1>Conclua sua Conta</h1>
				<form className="gap-y-6 flex flex-col" onSubmit={handleFinish}>
					<Input
						label="Nome de usuário"
						type="text"
						name="name"
						isInvalid={inputValidation.validated}
						errorMessage={inputValidation.message}
						onValueChange={(e) => {
							setInputValidation({
								validated: false,
								message: "",
							});
						}}
					></Input>

					<Button type="submit" color="primary">
						Confirmar
					</Button>
				</form>
			</div>
		</div>
	);
}
