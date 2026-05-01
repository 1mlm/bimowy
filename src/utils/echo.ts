import { inspect } from "node:util";

const emojis = {
	debug: "🐛",
	ok: "✅",
	err: "❌",
	yay: "🎉",
	warn: "⚠️",
	skip: "⏭️ ",
	prep: "⏳",
	start: "🚀"
} as const;

type Emoji = (typeof emojis)[keyof typeof emojis] | (string & {});

const inspectOptions = { colors: true, numericSeparator: true, depth: Infinity, compact: false };
export function echo(emoji: Emoji, message: unknown) {
	const now = new Date();

	const formattedNow =
		`${String(now.getDate()).padStart(2, "0")}D` +
		`/${String(now.getMonth() + 1).padStart(2, "0")}M` +
		` ${String(now.getHours()).padStart(2, "0")}` +
		`:${String(now.getMinutes()).padStart(2, "0")}` +
		`:${String(now.getSeconds()).padStart(2, "0")}`;

	const correctMessage = typeof message === "string" ? message : inspect(message, inspectOptions);

	console.log(`[${formattedNow}]${emoji ? ` ${emoji}` : ""} ${correctMessage}`);
}
