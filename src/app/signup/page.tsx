"use client";

import {
	EnvelopeIcon,
	KeyIcon,
	PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Link, Image } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
	const [loadingGoogle, setLoadingGoogle] = useState(false);
	const [loading, setLoading] = useState(false);
	const [inputError, setInputError] = useState({
		email: "",
		password: "",
	});
	const router = useRouter();

	function validateInputs(email: string, password: string) {
		let valid = true;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		// Check if email is empty
		if (!email) {
			setInputError({
				...inputError,
				email: "O email não pode estar vazio.",
			});
			valid = false;
		}
		// Check if email is valid
		else if (!emailRegex.test(email)) {
			setInputError({ ...inputError, email: "Email inválido." });
			valid = false;
		}

		// Check if password is empty
		if (!password) {
			setInputError({
				...inputError,
				password: "A senha não pode estar vazia.",
			});
			valid = false;
		}
		// Check if password length is less than 8
		else if (password.length < 8) {
			setInputError({
				...inputError,
				password: "A senha deve ter no mínimo 8 caracteres.",
			});
			valid = false;
		}

		return valid;
	}

	async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const password = formData.get("password") as string;
		const email = formData.get("email") as string;

		if (!validateInputs(email, password)) {
			setLoading(false);
			return false;
		}

		signUpHandler(
			formData.get("password") as string,
			formData.get("email") as string
		);
	}

	function signInGoogle() {
		signIn("google", { callbackUrl: process.env.BASE_URL });
	}

	async function signUpHandler(password: string, email: string) {
		try {
			const response = await fetch("/api/user", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});

			if (response.ok) {
				await signIn("credentials", {
					email: email,
					password: password,
					redirect: false,
				});
				router.push("/finish");
			} else {
				const data = await response.json();

				if (data.message == "email-in-use") {
					setInputError({
						...inputError,
						email: "Este email já está em uso.",
					});
				}
			}
		} catch (e: any) {
			console.error("Error:", e.message);
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
					<h1>Criar Conta</h1>
				</div>
				<form className="gap-y-6 flex flex-col" onSubmit={handleSignUp}>
					<Input
						placeholder="Email"
						type="text"
						name="email"
						isInvalid={Boolean(inputError.email)}
						errorMessage={inputError.email}
						classNames={{ inputWrapper: "h-14" }}
						startContent={
							<EnvelopeIcon className="h-6 text-neutral-500" />
						}
						onValueChange={() => {
							setInputError({ ...inputError, email: "" });
						}}
					></Input>
					<Input
						placeholder="Senha"
						type="password"
						name="password"
						isInvalid={Boolean(inputError.password)}
						errorMessage={inputError.password}
						classNames={{ inputWrapper: "h-14" }}
						startContent={
							<KeyIcon className="h-6 text-neutral-500" />
						}
						onValueChange={() => {
							setInputError({ ...inputError, password: "" });
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
									className="inverted-image"
									src="/google-logo.png"
									alt="logo-google"
								/>
							)
						}
					>
						Entrar com o Google
					</Button>
				</div>
				<div>
					<p className="text-center">
						<Link href="/login">Entrar em sua conta</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
