"use client";

import {
	CheckIcon,
	EnvelopeIcon,
	PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Image } from "@nextui-org/react";
import { useState } from "react";

export default function ForgotPassword() {
	const [loading, setLoading] = useState(false);
	const [inputEmailVal, setInputEmailVal] = useState({
		message: "",
		active: false,
	});
	const [emailSent, setEmailSent] = useState(false);

	async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const formData = new FormData(e.currentTarget);
		const formEmail: string = formData.get("email") as string;

		if (formEmail === "") {
			setInputEmailVal({
				message: "Email não pode estar vazio.",
				active: true,
			});
			setLoading(false);
			return false;
		}

		try {
			const response = await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: formEmail,
				}),
			});

			if (response.ok) {
				setEmailSent(true);
				setTimeout(() => {
					setEmailSent(false);
				}, 3000);

				setInputEmailVal({
					message: "",
					active: false,
				});
			} else {
				const data = await response.json();

				if (data.message == "request-already-pending") {
					setInputEmailVal({
						message: "Um código já foi enviado para esse email.",
						active: true,
					});
				}
			}
		} catch (e) {
			console.error(e);
		}

		setLoading(false);
	}

	return (
		<div className="flex w-full h-full items-center justify-center">
			<div className="flex flex-col gap-y-6 lg:w-[400px] md:w-[400px] sm:w-[300px]">
				<div className="flex w-full justify-center items-center gap-x-4 mb-6">
					<Image
						src="/brand/logo.svg"
						className="h-16 inverted-image"
						alt="logo"
					/>
					<div>
						<h2 className="w-[280px]">Recuperar Conta</h2>
						<p className="w-[280px]">
							Escreva seu email para receber um código de
							recuperação.
						</p>
					</div>
				</div>
				<form
					className="gap-y-6 flex flex-col"
					onSubmit={handleForgotPassword}
				>
					<Input
						placeholder="Email"
						type="email"
						name="email"
						classNames={{ inputWrapper: "h-14" }}
						startContent={
							<EnvelopeIcon className="h-6 text-neutral-500" />
						}
						isInvalid={inputEmailVal.active}
						errorMessage={inputEmailVal.message}
						onValueChange={() => {
							setInputEmailVal({
								message: "",
								active: false,
							});
						}}
					></Input>

					<Button
						type="submit"
						color={emailSent ? "success" : "primary"}
						isLoading={loading}
						startContent={
							loading ? (
								""
							) : emailSent ? (
								<CheckIcon className="h-6" />
							) : (
								<PaperAirplaneIcon className="h-6" />
							)
						}
					>
						Enviar
					</Button>
				</form>
			</div>
		</div>
	);
}
