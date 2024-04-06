"use client";

import exportURL from "@/lib/baseUrl";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { Button, Input, Link, Image } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Login() {
	const [loading, setLoading] = useState(false);
	const [inputEmailVal, setInputEmailVal] = useState({
		message: "",
		active: false,
	});
	const [inputPasswordVal, setInputPasswordVal] = useState({
		message: "",
		active: false,
	});

	async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const formEmail: string = formData.get("email") as string;
		const formPassword: string = formData.get("password") as string;

		if (formEmail === "") {
			setInputEmailVal({
				message: "Email não pode estar vazio.",
				active: true,
			});
			setLoading(false);
			return false;
		}

		if (formPassword === "") {
			setInputPasswordVal({
				message: "Senha não pode estar vazia.",
				active: true,
			});
			setLoading(false);
			return false;
		}

		const signInResult: any = await signIn("credentials", {
			email: formData.get("email"),
			password: formData.get("password"),
			redirect: false,
		});

		if (signInResult.error == "password-not-match") {
			setInputPasswordVal({
				message: "Senha incorreta.",
				active: true,
			});
			setLoading(false);
		}
	}

	function signInGoogle() {
		signIn("google", { callbackUrl: process.env.BASE_URL });
	}

	return (
		<div className="flex w-full h-full items-center justify-center">
			<div className="flex flex-col gap-y-6 w-[400px]">
				<h1>Login</h1>
				<form className="gap-y-6 flex flex-col" onSubmit={handleLogin}>
					<Input label="Email" type="email" name="email"></Input>
					<Input
						label="Senha"
						type="password"
						name="password"
					></Input>

					<Button
						type="submit"
						color="primary"
						isLoading={loading}
						startContent={
							loading ? (
								""
							) : (
								<ArrowLeftEndOnRectangleIcon className="h-6" />
							)
						}
					>
						Entrar
					</Button>
				</form>
				<div className="flex flex-col gap-y-6">
					<p className="text-center">Ou</p>
					<Button
						onClick={signInGoogle}
						startContent={
							<Image
								width="20"
								style={{ filter: "invert()" }}
								src="/google-logo.svg"
							/>
						}
					>
						Entrar com o Google
					</Button>
				</div>
				<div>
					<p className="text-center">
						Não tem uma conta? <Link href="/signup">Crie uma</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
