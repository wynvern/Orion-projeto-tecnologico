"use client";

import { Button, Input } from "@nextui-org/react";

export default function Login() {
	function handleLogin(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		console.log(formData.get("email"));
	}

	return (
		<div className="flex w-full h-full items-center justify-center">
			<div className="flex flex-col gap-y-6 w-[400px]">
				<h1>Login</h1>
				<form className="gap-y-6 flex flex-col" onSubmit={handleLogin}>
					<Input label="Email" name="email"></Input>
					<Input label="Senha" name="password"></Input>

					<Button type="submit" color="primary">
						Entrar
					</Button>
				</form>
				<div className="flex flex-col gap-y-6">
					<p className="text-center">Ou</p>
					<Button>Entrar com o Google</Button>
				</div>
			</div>
		</div>
	);
}
