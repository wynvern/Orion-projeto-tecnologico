"use client";

import {
	ArrowLeftEndOnRectangleIcon,
	EnvelopeIcon,
	KeyIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Link, Image } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
	const [loading, setLoading] = useState(false);
	const [loadingGoogle, setLoadingGoogle] = useState(false);
	const [inputEmailVal, setInputEmailVal] = useState({
		message: "",
		active: false,
	});
	const router = useRouter();
	const [inputPasswordVal, setInputPasswordVal] = useState({
		message: "",
		active: false,
	});

	async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		const formData = new FormData(e.currentTarget);

		const formEmail: string = formData.get("email") as string;
		const formPassword: string = formData.get("password") as string;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

		if (!emailRegex.test(formEmail)) {
			setInputEmailVal({
				message: "Email digitado é inválido.",
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
		}

		if (signInResult.error == "email-not-found") {
			setInputEmailVal({
				message: "Email não encontrado.",
				active: true,
			});
		}

		setLoading(false);
		router.push("/finish");
	}

	function signInGoogle() {
		signIn("google", { callbackUrl: process.env.BASE_URL });
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
					<h1>Login</h1>
				</div>
				<form className="gap-y-6 flex flex-col" onSubmit={handleLogin}>
					<Input
						placeholder="Email"
						type="text"
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
					<div>
						<Input
							placeholder="Senha"
							type="password"
							name="password"
							classNames={{ inputWrapper: "h-14" }}
							startContent={
								<KeyIcon className="h-6 text-neutral-500" />
							}
							isInvalid={inputPasswordVal.active}
							errorMessage={inputPasswordVal.message}
							onValueChange={() => {
								setInputPasswordVal({
									message: "",
									active: false,
								});
							}}
						></Input>

						<div className="mt-4">
							<p className="text-center">
								<Link href="/forgot-password">
									Esqueceu sua senha?
								</Link>
							</p>
						</div>
					</div>

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
						<Link href="/signup">Crie uma conta</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
