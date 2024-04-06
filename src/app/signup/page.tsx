"use client";

import { Button, Input, Link } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignUp() {
	const [passwordIsInvalid, setPasswordIsInvalid] = useState({
		bool: false,
		message: "",
	});
	const [emailIsInvalid, setEmailIsInvalid] = useState({
		bool: false,
		message: "",
	});

	async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

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
				setPasswordIsInvalid({ message: "erro tal", bool: true });
			}
		} catch (e: any) {
			console.error("Error:", e.message); //mudar
		}
	}

	return (
		<div className="flex w-full h-full items-center justify-center">
			<div className="flex flex-col gap-y-6 w-[400px]">
				<h1>Criar Conta</h1>
				<form className="gap-y-6 flex flex-col" onSubmit={handleSignUp}>
					<Input
						label="Nome de usuário"
						type="text"
						name="name"
						isInvalid={passwordIsInvalid.bool}
						placeholder={passwordIsInvalid.message}
						onValueChange={(e) => {
							setPasswordIsInvalid({ message: "", bool: false });
						}}
					></Input>
					<Input label="Email" type="email" name="email"></Input>
					<Input
						label="Senha"
						type="password"
						name="password"
					></Input>

					<Button type="submit" color="primary">
						Criar
					</Button>
				</form>
				<div className="flex flex-col gap-y-6">
					<p className="text-center">Ou</p>
					<Button onClick={signInGoogle}>Entrar com o Google</Button>
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
