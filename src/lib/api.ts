export function removePasswordFields(users: any) {
	return users.map((user: any) => {
		const { password, ...rest } = user;
		return rest;
	});
}
