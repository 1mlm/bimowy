import type { TagCreateArgs } from "@/db/generated/models";

export const FAKE_TAGS: TagCreateArgs["data"][] = [
	{ handle: "math", title: "Math", aliases: ["mathematics"] },
	{ handle: "arithmetic", title: "Arithmetic", aliases: ["calc"] },
	{ handle: "algebra", title: "Algebra", aliases: ["exponents", "powers"] }
];
