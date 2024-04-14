export default async function request(
	url: string,
	method: string = "GET",
	headers: Record<string, string> = {},
	body: any = undefined
) {
	try {
		const response = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
			body: body ? JSON.stringify(body) : undefined,
		});

		if (response.ok) {
			return await response.json();
		} else {
			const data = await response.json();
			throw data.message || response.statusText;
		}
	} catch (e: any) {
		throw new Error(e);
	}
}
