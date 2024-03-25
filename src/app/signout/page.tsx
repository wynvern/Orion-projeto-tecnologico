"use client";

import { Button, Input, Link } from "@nextui-org/react";
import { signIn, signOut } from "next-auth/react";

export default function SignOut() {
	async function handleSignOut(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		signOut();
	}

	return (
		<div className="flex w-full h-full items-center justify-center">
			<div className="flex flex-col gap-y-6 w-[400px]">
				<div>
					<h1>Sair</h1>
					<p>Tem certeza que deseja deconectar a sua conta?</p>
				</div>
				<form
					className="gap-y-6 flex flex-col"
					onSubmit={handleSignOut}
				>
					<Button type="submit" color="primary">
						Sair
					</Button>
				</form>
			</div>
		</div>
	);
}
