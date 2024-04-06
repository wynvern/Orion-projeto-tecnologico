"use client";

import exportURL from "@/lib/baseUrl";
import {
	ArrowLeftEndOnRectangleIcon,
	EnvelopeIcon,
	KeyIcon,
	PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Link, Image } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Login() {
	const [loading, setLoading] = useState(false);
	const [inputEmailVal, setInputEmailVal] = useState({
		message: "",
		active: false,
	});
	async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
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

		const signInResult: any = await signIn("credentials", {
			email: formData.get("email"),
			password: formData.get("password"),
			redirect: false,
		});

		setLoading(false);
	}

	return (
		<div className="flex w-full h-full items-center justify-center">
			<div className="flex flex-col gap-y-6 lg:w-[400px] md:w-[400px] sm:w-[300px]">
				<div className="flex w-full justify-center items-center gap-x-4 mb-6">
					<Image src="/brand/logo.svg" className="h-16" />
					<h1>Recuperar Conta</h1>
				</div>
				<form className="gap-y-6 flex flex-col" onSubmit={handleLogin}>
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
						color="primary"
						isLoading={loading}
						startContent={
							loading ? "" : <PaperAirplaneIcon className="h-6" />
						}
					>
						Enviar
					</Button>
				</form>
			</div>
		</div>
	);
}
