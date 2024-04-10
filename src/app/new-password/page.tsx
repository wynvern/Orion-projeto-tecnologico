"use client";

import { KeyIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Button, Input, Image } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function UpdatePassword() {
	const [loading, setLoading] = useState(false);
	const [inputPasswordval, setInputPasswordval] = useState({
		message: "",
		active: false,
	});
	const [inputPasswordCheckVal, setInputasswordCheckVal] = useState({
		message: "",
		active: false,
	});
	const params = useSearchParams();
	const router = useRouter();
	const [emailSent, setEmailSent] = useState(false);

	const verificationCode = params.get("verificationCode");

	if (!verificationCode) {
		router.push("/forgot-password");
	}
	const expireDate = params.get("expTime");

	async function updatePassword(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const formData = new FormData(e.currentTarget);
		const formPassword: string = formData.get("password") as string;
		const formPasswordCheck: string = formData.get(
			"password_check"
		) as string;

		if (formPassword === "" || formPassword.length < 8) {
			setInputPasswordval({
				message: "A senha digitada não é aceita.",
				active: true,
			});
			setLoading(false);
			return false;
		}

		if (formPasswordCheck === "") {
			setInputasswordCheckVal({
				message: "Este campo não pode estar vazio.",
				active: true,
			});
			setLoading(false);
			return false;
		}

		if (formPassword !== formPasswordCheck) {
			setInputasswordCheckVal({
				message: "As senhas não coincidem.",
				active: true,
			});
			setLoading(false);
			return false;
		}

		try {
			const response = await fetch("/api/auth/forgot-password", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					code: verificationCode,
					newPassword: formPassword,
				}),
			});

			if (response.ok) {
				setEmailSent(true);
				setTimeout(() => {
					setEmailSent(false);
				}, 3000);
			} else {
				const data = await response.json();

				if (data.message == "invalid-code") {
					setInputPasswordval({
						message: "Esta requisição expirou, tente novamente.",
						active: true,
					});
				}

				if (data.message == "different-oauth") {
					setInputPasswordval({
						message: "Este email utiliza outra forma de login.",
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

	return (
		<div className="flex w-full h-full items-center justify-center">
			<div className="flex flex-col gap-y-6 lg:w-[400px] md:w-[400px] sm:w-[300px]">
				<div className="flex w-full justify-center items-center gap-x-4 mb-6">
					<Image src="/brand/logo.svg" className="h-16" />
					<h1>Nova Senha</h1>
				</div>
				<form
					className="gap-y-6 flex flex-col"
					onSubmit={updatePassword}
				>
					<Input
						placeholder="Nova Senha"
						type="password"
						name="password"
						classNames={{ inputWrapper: "h-14" }}
						startContent={
							<KeyIcon className="h-6 text-neutral-500" />
						}
						isInvalid={inputPasswordval.active}
						errorMessage={inputPasswordval.message}
						onValueChange={() => {
							setInputPasswordval({
								message: "",
								active: false,
							});
						}}
					></Input>
					<Input
						placeholder="Repita a Senha"
						type="password"
						name="password_check"
						classNames={{ inputWrapper: "h-14" }}
						startContent={
							<KeyIcon className="h-6 text-neutral-500" />
						}
						isInvalid={inputPasswordCheckVal.active}
						errorMessage={inputPasswordCheckVal.message}
						onValueChange={() => {
							setInputasswordCheckVal({
								message: "",
								active: false,
							});
						}}
					></Input>

					<Button
						type="submit"
						color="primary"
						isLoading={loading}
						startContent={
							loading ? "" : <PaperAirplaneIcon className="h-6" />
						}
					>
						Atualizar
					</Button>
				</form>
			</div>
		</div>
	);
}
