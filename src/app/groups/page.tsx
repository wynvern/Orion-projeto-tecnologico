"use client";

import GroupCard from "@/components/Cards/GroupCard";
import CreateGroup from "@/components/modal/CreateGroup";
import { PlusIcon } from "@heroicons/react/24/outline";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";
import { Button, ScrollShadow } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface Category {
	label: string;
	value: string;
	description: string;
}

export default function Groups() {
	const [groupModal, setGroupModal] = useState(false);

	const [categoriesServer, setCategoriesServer] = useState([]);
	const [groups, setGroups]: any[] = useState([]);

	async function fetchCategories() {
		try {
			const response = await fetch("/api/categories");

			if (response.ok) {
				const data = await response.json();
				setCategoriesServer(data);
			}
		} catch (e) {
			console.error(e);
		}
	}

	async function fetchGroups() {
		try {
			const response = await fetch("/api/query/group?recents=true");

			if (response.ok) {
				const data = await response.json();
				setGroups(data.groups);
				console.log(data);
			}
		} catch (e) {
			console.error(e);
		}
	}

	useEffect(() => {
		fetchCategories();
		fetchGroups();
	}, []);

	// TODO: Show message that no recent groups
	return (
		<div className="w-full h-full">
			<div className="w-full h-full flex items-center justify-center overflow-y-auto pt-20">
				<div className="w-full h-full">
					<div className="pl-40 flex gap-x-4">
						<UserGroupIcon className="h-10" />
						<h1>Grupos</h1>
					</div>
					<h2 className="pl-40 pt-4">Uma forma social de aprender</h2>
					<p className="pl-40 pt-2 max-w-[50%]">
						Crie e explore grupos temáticos e junte-se àqueles que
						mais combinam com seus interesses de estudo.
					</p>
					<ScrollShadow
						className="flex flex-row items-center mt-14"
						orientation="horizontal"
					>
						<div>
							<div className="w-40"></div>
						</div>
						<div className="gap-x-6 flex">
							<div
								key={-1}
								className="bg-primary rounded-large shadow-custom"
							>
								<div className="w-[300px] h-[300px] p-6 flex justify-between flex-col">
									<div>
										<h3>Crie o seu próprio</h3>
										<p className="pt-4">
											Crie o seu grupo personalizado para
											assuntos específicos, turmas e muito
											mais.
										</p>
									</div>
									<Button
										color="default"
										className="bg-white text-black"
										startContent={
											<PlusIcon className="h-6" />
										}
										onClick={() =>
											setGroupModal(!groupModal)
										}
									>
										Criar
									</Button>
								</div>
							</div>
							{categoriesServer.map((i: Category, _) => (
								<div
									key={_}
									className="bg-default-100 w-[300px] h-[300px] rounded-large"
								>
									<div className=" w-[300px] h-[300px] p-6 flex flex-col justify-between">
										<div>
											<h3>{i.label}</h3>
											<p className="pt-4">
												{i.description}
											</p>
										</div>
										<Button
											color="default"
											className="bg-white text-black"
										>
											Ver
										</Button>
									</div>
								</div>
							))}
						</div>
					</ScrollShadow>
					<h2 className="pl-40 mt-20">Recentes</h2>
					<p className="pl-40">
						Veja os grupos que você visualizou recentemente.
					</p>
					<ScrollShadow
						orientation="horizontal"
						className="flex mt-14 "
					>
						<div>
							<div className="w-40"></div>
						</div>
						<div className="gap-x-6 flex">
							{groups.map((i: any, _: number) => (
								<div key={_}>
									<GroupCard
										update={() =>
											console.log("not implemented")
										}
										group={i}
									/>
								</div>
							))}
						</div>
					</ScrollShadow>

					<div className="h-[200px]"></div>
				</div>
			</div>

			<CreateGroup isActive={groupModal} setIsActive={setGroupModal} />
		</div>
	);
}
