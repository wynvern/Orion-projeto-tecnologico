"use client";

import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { Button, Input, Link } from "@nextui-org/react";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function SignOut() {
	const [loading, setLoading] = useState(false);
	async function handleSignOut(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		signOut();
	}

	return (
		<div className="flex w-full h-full items-center justify-center">
			<div className="flex flex-col gap-y-6 w-[400px]">
				<div>
					<h1>Sair</h1>
					<p>Tem certeza que deseja se desconectar da sua conta?</p>
				</div>
				<form
					className="gap-y-6 flex flex-col"
					onSubmit={handleSignOut}
				>
					<Button
						type="submit"
						color="primary"
						isLoading={loading}
						startContent={
							loading ? (
								""
							) : (
								<ArrowLeftStartOnRectangleIcon className="h-6" />
							)
						}
					>
						Sair
					</Button>
				</form>
			</div>
		</div>
	);
}
