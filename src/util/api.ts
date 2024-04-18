export default async function request(
	url: string,
	method = "GET",
	headers: Record<string, string> = {},
	body: unknown = undefined
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
		}
		const data = await response.json();
		throw data.message || response.statusText;
	} catch (e: unknown) {
		throw new Error(e as string);
	}
}
