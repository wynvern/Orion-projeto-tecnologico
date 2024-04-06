"use client";

import { UserIcon } from "@heroicons/react/24/solid";
import { Button, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Finish() {
	const { update } = useSession();
	const router = useRouter();
	const [inputValidation, setInputValidation] = useState({
		message: "",
		active: false,
	});
	const [isLoading, setIsLoading] = useState(false);

	async function handleFinish(e: React.FormEvent<HTMLFormElement>) {
		setIsLoading(true);
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const formName: string = formData.get("name") as string;

		if (formName === "" || formName.length < 3) {
			setInputValidation({
				message: "Nome de usuário não aceito.",
				active: true,
			});
			setIsLoading(false);
			return false;
		}

		handleFinishPost(formData.get("name") as string);
		setIsLoading(false);
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

				if (data.message == "username-in-use") {
					setInputValidation({
						message: "Este nome de usuário já está em uso.",
						active: true,
					});
				}
			}
		} catch (e: any) {
			console.error("Error:", e.message);
		}
	}

	return (
		<div className="flex w-full h-full items-center justify-center">
			<div className="flex flex-col gap-y-6 w-[400px]">
				<h1>Conclua sua Conta</h1>
				<p>Escolha um nome para o seu perfil.</p>
				<br />
				<form className="gap-y-6 flex flex-col" onSubmit={handleFinish}>
					<Input
						placeholder="Nome de usuário"
						type="text"
						name="name"
						isInvalid={inputValidation.active}
						errorMessage={inputValidation.message}
						classNames={{ inputWrapper: "h-14" }}
						startContent={
							<>
								<UserIcon className="h-6 text-neutral-500" />
							</>
						}
						onValueChange={(e) => {
							setInputValidation({
								active: false,
								message: "",
							});
						}}
					></Input>

					<Button type="submit" color="primary" isLoading={isLoading}>
						Confirmar
					</Button>
				</form>
			</div>
		</div>
	);
}
