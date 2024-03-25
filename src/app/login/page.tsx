"use client";

import exportURL from "@/lib/baseUrl";
import { Button, Input, Link } from "@nextui-org/react";
import { signIn } from "next-auth/react";

export default function Login() {
	async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		console.log("doing login");

		await signIn("credentials", {
			email: formData.get("email"),
			password: formData.get("password"),
			redirect: false,
		});
	}

	console.log(exportURL());
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

					<Button type="submit" color="primary">
						Entrar
					</Button>
				</form>
				<div className="flex flex-col gap-y-6">
					<p className="text-center">Ou</p>
					<Button onClick={signInGoogle}>Entrar com o Google</Button>
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
