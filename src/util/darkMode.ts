import { useEffect, useState } from "react";

export default () => {
	const [theme, setTheme] = useState("0");

	const toggleTheme = () => {
		if (theme === "1") {
			setTheme("0");
		} else {
			setTheme("1");
		}
	};

	useEffect(() => {
		const localTheme = localStorage.getItem("darkMode");
		if (localTheme) {
			setTheme(localTheme);
		}
	}, []);

	return {
		theme,
		toggleTheme,
	};
};
