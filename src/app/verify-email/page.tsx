"use client";

import request from "@/util/api";
import {
	AtSymbolIcon,
	CheckIcon,
	PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Image, Link } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmail() {
	const [loading, setLoading] = useState(false);
	const [inputError, setInputError] = useState("");
	const router = useRouter();
	const { update } = useSession();

	const [success, setSuccess] = useState(false);
	const session = useSession();
	const [codeSent, setCodeSent] = useState(false);

	async function sendRequest(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		try {
			await request("/api/auth/verify-email", "POST", undefined, {
				email: session.data?.user.email,
			});
		} catch (error) {
			setInputError("O código já foi enviado para o email.");
			setLoading(false);
			return false;
		}
		setSuccess(true);
		setLoading(false);
		setTimeout(() => {
			setSuccess(false);
			setCodeSent(true);
		}, 1000);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Clears an input error when the code is sent>
	useEffect(() => {
		setInputError("");
	}, [codeSent]);

	async function verifyCode(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const formCode: string = formData.get("code") as string;

		if (formCode === "") {
			setInputError("Este campo não pode estar vazio.");
			return false;
		}

		setLoading(true);
		try {
			await request("/api/auth/verify-email", "PATCH", undefined, {
				code: formCode,
			});
		} catch (e: unknown) {
			setLoading(false);
			console.log((e as Error).message);
			if ((e as Error).message === "invalid-code")
				setInputError("Código inválido.");
			return false;
		}
		update({ emailVerified: new Date() });
		setSuccess(true);
		setLoading(false);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <router is not necessary>
	useEffect(() => {
		if (session.data?.user.emailVerified) {
			router.push("/login");
		}
	}, [session]);

	if (codeSent)
		return (
			<div className="flex w-full h-dvh items-center justify-center">
				<div className="flex flex-col gap-y-6 w-full max-w-[400px] px-4">
					<div className="flex w-full justify-center items-center gap-x-4 mb-6">
						<Image
							src="/brand/logo.svg"
							className="h-16 inverted-image"
							alt="logo"
						/>
						<div>
							<h2 className="max-w-[250px]">Verificar Email</h2>
							<p className="max-w-[250px]">
								Digite o código de verificação enviado para o
								seu email.
							</p>
						</div>
					</div>
					<form
						className="gap-y-6 flex flex-col"
						onSubmit={verifyCode}
					>
						<Input
							name="code"
							placeholder="Código"
							startContent={<AtSymbolIcon className="h-6" />}
							errorMessage={inputError}
							isInvalid={Boolean(inputError)}
							classNames={{ inputWrapper: "h-14" }}
							onChange={() => setInputError("")}
						/>
						<Button
							type="submit"
							color={success ? "success" : "primary"}
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
							{success ? "Enviado" : "Enviar"}
						</Button>
						{success ? (
							<p className="text-center">
								Vá para a página de{" "}
								<Link href="/login">Login</Link>
							</p>
						) : (
							""
						)}
						<Link
							onClick={() => setCodeSent(false)}
							className="w-full text-center flex justify-center items-center gap-x-2"
						>
							Voltar
						</Link>
					</form>
				</div>
			</div>
		);

	return (
		<div className="flex w-full h-dvh items-center justify-center">
			<div className="flex flex-col gap-y-6 lg:w-[400px] md:w-[400px] sm:w-[300px]">
				<div className="flex w-full justify-center items-center gap-x-4 mb-6">
					<Image
						src="/brand/logo.svg"
						className="h-16 inverted-image"
						alt="logo"
					/>
					<div>
						<h2 className="max-w-[250px]">Verificar Email</h2>
						<p className="max-w-[250px]">
							Clique no botão para receber um código por email.
						</p>
					</div>
				</div>
				<form className="gap-y-6 flex flex-col" onSubmit={sendRequest}>
					<Button
						type="submit"
						color={success ? "success" : "primary"}
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
						{success ? "Enviado" : "Enviar"}
					</Button>
					{success ? (
						<p className="text-center">
							Vá para a página de <Link href="/login">Login</Link>
						</p>
					) : (
						""
					)}
					{inputError ? (
						<p className="text-danger w-full text-center">
							{inputError}
						</p>
					) : (
						""
					)}
					<p className="w-full text-center">
						<Link onClick={() => setCodeSent(true)}>
							Já possuí um código?
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
