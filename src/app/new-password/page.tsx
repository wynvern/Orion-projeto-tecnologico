"use client";

import request from "@/util/api";
import {
	CheckIcon,
	KeyIcon,
	PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Image, Link } from "@nextui-org/react";
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
	const [success, setSuccess] = useState(false);

	const verificationCode = params.get("verificationCode");

	if (!verificationCode) {
		router.push("/forgot-password");
	}

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
			const response = await request(
				"/api/auth/forgot-password",
				"PATCH",
				{},
				{
					code: verificationCode,
					newPassword: formPassword,
				}
			);
			if (response) {
				setSuccess(true);
			} else {
				const data = await response.json();

				if (data.message === "invalid-code") {
					setInputPasswordval({
						message: "Esta requisição expirou, tente novamente.",
						active: true,
					});
				}

				if (data.message === "different-oauth") {
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
			<div className="flex flex-col gap-y-6 w-full max-w-[400px] px-4">
				<div className="flex w-full justify-center items-center gap-x-4 mb-6">
					<Image
						src="/brand/logo.svg"
						className="h-16 inverted-image"
						alt="logo"
					/>
					<div>
						<h1 className="max-w-[200px]">Nova Senha</h1>
						<p className="max-w-[200px]">Escolha uma nova senha.</p>
					</div>
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
					/>
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
					/>
					<Button
						type="submit"
						color="primary"
						isLoading={loading}
						startContent={
							loading ? (
								""
							) : success ? (
								<CheckIcon className="h-6" />
							) : (
								<PaperAirplaneIcon className="h-6" />
							)
						}
					>
						{success ? "Atualizado" : "Atualizar"}
					</Button>
					{success ? (
						<p className="text-center">
							Vá para a página de <Link href="/login">Login</Link>
						</p>
					) : (
						""
					)}
				</form>
			</div>
		</div>
	);
}
