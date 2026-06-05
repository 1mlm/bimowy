export function formatToPascalCase(str: string) {
	return str
		.split("_")
		.map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}
