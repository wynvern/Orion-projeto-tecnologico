export function prettyDateTime(dateString: any) {
	// Create a new Date object from the input string
	const date = new Date(dateString);

	// Get the current locale of the browser
	const locale = navigator.language;

	// Define the month names in Portuguese
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

	// Get the month, day, and year from the Date object
	const month = monthNames[date.getMonth()];
	const day = date.getDate();
	const year = date.getFullYear();

	// Get the hours and minutes from the Date object
	let hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? "pm" : "am";
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'

	// Get the current year
	const currentYear = new Date().getFullYear();

	// Construct the formatted date string
	let formattedDate = `${day} ${month} ${hours}:${minutes
		.toString()
		.padStart(2, "0")} ${ampm}`;

	// Add the year at the start if the date is not in the current year
	if (year !== currentYear) {
		formattedDate = `${year} ${formattedDate}`;
	}

	return formattedDate;
}
