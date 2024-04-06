"use client";

import {
	EnvelopeIcon,
	KeyIcon,
	PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Link, Image } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignUp() {
	const [emailIsInvalid, setEmailIsInvalid] = useState({
		bool: false,
		message: "",
	});
	const [passwordIsInvalid, setPasswordIsInvalid] = useState({
		bool: false,
		message: "",
	});
	const [loadingGoogle, setLoadingGoogle] = useState(false);
	const [loading, setLoading] = useState(false);

	async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		// Reset validation states
		setEmailIsInvalid({ bool: false, message: "" });
		setPasswordIsInvalid({ bool: false, message: "" });

		// Basic frontend validation
		if (!email.trim()) {
			setEmailIsInvalid({ bool: true, message: "Email é obrigatório." });
			setLoading(false);
			return;
		}

		if (!password.trim()) {
			setPasswordIsInvalid({
				bool: true,
				message: "Senha é obrigatória.",
			});
			setLoading(false);
			return;
		}

		signUpHandler(
			formData.get("name") as string,
			formData.get("password") as string,
			formData.get("email") as string
		);
	}

	function signInGoogle() {
		signIn("google", { callbackUrl: `${process.env.BASE_URL}` });
	}

	async function signUpHandler(
		name: string,
		password: string,
		email: string
	) {
		try {
			const response = await fetch("/api/user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					email,
					password,
				}),
			});

			if (response.ok) {
				await signIn("credentials", {
					// Timeout removed
					email: email,
					password: password,
					redirect: false,
				});
			} else {
				const data = await response.json(); // Something?
				console.log(data);

				if (data.message == "email-in-use") {
					setEmailIsInvalid({
						bool: true,
						message: "Email já está em uso.",
					});
				}

				if (data.message == "weak-password") {
					setPasswordIsInvalid({
						bool: true,
						message: "Senha deve conter 8 caracteres ou mais.",
					});
				}
			}
		} catch (e: any) {
			console.error("Error:", e.message); //mudar
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex w-full h-full items-center justify-center">
			<div className="flex flex-col gap-y-6 lg:w-[400px] md:w-[400px] sm:w-[300px]">
				<div className="flex w-full justify-center items-center gap-x-4 mb-6">
					<Image src="/brand/logo.svg" className="h-16" />
					<h1>Criar Conta</h1>
				</div>
				<form className="gap-y-6 flex flex-col" onSubmit={handleSignUp}>
					<Input
						placeholder="Email"
						type="email"
						name="email"
						isInvalid={emailIsInvalid.bool}
						errorMessage={emailIsInvalid.message}
						classNames={{ inputWrapper: "h-14" }}
						startContent={
							<EnvelopeIcon className="h-6 text-neutral-500" />
						}
						onValueChange={() => {
							setEmailIsInvalid({
								message: "",
								bool: false,
							});
						}}
					></Input>
					<Input
						placeholder="Senha"
						type="password"
						name="password"
						isInvalid={passwordIsInvalid.bool}
						errorMessage={passwordIsInvalid.message}
						classNames={{ inputWrapper: "h-14" }}
						startContent={
							<KeyIcon className="h-6 text-neutral-500" />
						}
						onValueChange={() => {
							setPasswordIsInvalid({
								message: "",
								bool: false,
							});
						}}
					></Input>

					<Button
						type="submit"
						color="primary"
						isLoading={loading}
						startContent={
							loading ? "" : <PencilSquareIcon className="h-6" />
						}
					>
						Criar
					</Button>
				</form>
				<div className="flex flex-col gap-y-6">
					<p className="text-center">Ou</p>
					<Button
						onClick={() => {
							setLoadingGoogle(true);
							signInGoogle();
						}}
						isLoading={loadingGoogle}
						startContent={
							loadingGoogle ? (
								""
							) : (
								<Image
									width="20"
									style={{ filter: "invert()" }}
									src="/google-logo.svg"
								/>
							)
						}
					>
						Entrar com o Google
					</Button>
				</div>
				<div>
					<p className="text-center">
						Já possui uma conta? <Link href="/login">Entrar</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
