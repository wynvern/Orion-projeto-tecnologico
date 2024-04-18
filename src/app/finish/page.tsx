"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
import { ArrowLongRightIcon, UserIcon } from "@heroicons/react/24/solid";
import { Button, Input, Image } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Finish() {
	const { update } = useSession();
	const router = useRouter();
	const [inputValidation, setInputValidation] = useState({
		message: "",
		active: false,
	});
	const [isLoading, setIsLoading] = useState(false);
	const session = useSession();
	const [success, setSuccess] = useState(false);

	function isValidString(str: string) {
		const regex = /^[a-z._]+$/;
		return regex.test(str);
	}

	useEffect(() => {
		// TODO: Chech if this is going to work
		if (session.data?.user.username) {
			router.push("/");
		}
	}, [session, router]);

	async function handleFinish(e: React.FormEvent<HTMLFormElement>) {
		setIsLoading(true);
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const formName: string = formData.get("name") as string;

		if (formName === "" || formName.length < 3) {
			setInputValidation({
				message: "O nome de usuário é obrigatório.",
				active: true,
			});
			setIsLoading(false);
			return false;
		}

		if (formName.length < 3) {
			setInputValidation({
				message: "O nome de usuário precisa ter 3 caracteres ou mais.",
				active: true,
			});
			setIsLoading(false);
			return false;
		}

		if (formName.length > 20) {
			setInputValidation({
				message:
					"O nome de usuário pode ter somente até 20 caracteres.",
				active: true,
			});
			setIsLoading(false);
			return false;
		}

		if (!isValidString(formName)) {
			setInputValidation({
				message:
					"O nome de usuário pode ter somente letras pontos e underscore.",
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
				setSuccess(true);
				update({ username: data.newName });
			} else {
				const data = await response.json();

				if (data.message === "username-in-use") {
					setInputValidation({
						message: "Este nome de usuário já está em uso.",
						active: true,
					});
				}
			}
		} catch (e: unknown) {
			console.error("Error:", (e as Error).message);
		}
	}

	return (
		<div className="flex w-full h-full items-center justify-center">
			<div className="flex flex-col w-[400px]">
				<div className="flex w-full justify-center items-center gap-x-4 mb-6">
					<Image
						src="/brand/logo.svg"
						className="h-16 w-16 inverted-image"
						alt="profile-picture"
					/>
					<h2 className="w-[280px]">
						Escolha um nome para o seu perfil
					</h2>
				</div>
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
						onValueChange={() => {
							setInputValidation({
								active: false,
								message: "",
							});
						}}
					/>

					<Button
						type="submit"
						color={success ? "success" : "primary"}
						isLoading={isLoading}
					>
						Confirmar
						{isLoading ? (
							""
						) : success ? (
							<CheckIcon className="h-6" />
						) : (
							<ArrowLongRightIcon className="h-6" />
						)}
					</Button>
				</form>
			</div>
		</div>
	);
}
