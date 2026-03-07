import { inspect } from "node:util";

const emojis = {
	ok: "✅",
	err: "❌",
	yay: "🎉",
	warn: "⚠️",
	info: "🟦",
	debug: "🐛",
	skip: "⏭️ ",
	prep: "⏳",
	start: "🚀",
	end: "🏁",
	fail: "💥",
	question: "❓",
	delete: "🗑️ "
} as const;

type Emoji = (typeof emojis)[keyof typeof emojis] | (string & {});

export function echo(emoji: Emoji, message: unknown, level: number = 0) {
	const now = new Date();

	const formattedNow =
		`${String(now.getDate()).padStart(2, "0")}D` +
		`/${String(now.getMonth() + 1).padStart(2, "0")}M` +
		` ${String(now.getHours()).padStart(2, "0")}` +
		`:${String(now.getMinutes()).padStart(2, "0")}` +
		`:${String(now.getSeconds()).padStart(2, "0")}`;

	const correctMessage =
		typeof message === "string"
			? message
			: inspect(message, { colors: true, numericSeparator: true, depth: Infinity });

	console.log(`[${formattedNow}]${" ".repeat(level + 1)}${emoji} ${correctMessage}`);
}
