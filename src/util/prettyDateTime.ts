export function prettyDateTime(dateString: any) {
	const date = new Date(dateString);

	const monthNames = [
		"Jan",
		"Fev",
		"Mar",
		"Abr",
		"Mai",
		"Jun",
		"Jul",
		"Ago",
		"Set",
		"Out",
		"Nov",
		"Dez",
	];

	const month = monthNames[date.getMonth()];
	const day = date.getDate();
	const year = date.getFullYear();

	let hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? "pm" : "am";
	hours = hours % 12;
	hours = hours ? hours : 12;

	const currentYear = new Date().getFullYear();

	let formattedDate = `${day} ${month} ${hours}:${minutes
		.toString()
		.padStart(2, "0")} ${ampm}`;

	if (year !== currentYear) {
		formattedDate = `${year} ${formattedDate}`;
	}

	return formattedDate;
}
