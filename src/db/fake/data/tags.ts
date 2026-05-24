import type { TagCreateArgs } from "@/db/generated/models";

export const FAKE_TAGS: TagCreateArgs["data"][] = [
	{ handle: "math", title: "Math", aliases: ["mathematics"] },
	{ handle: "arithmetic", title: "Arithmetic", aliases: ["calc"] },
	{ handle: "algebra", title: "Algebra", aliases: ["exponents", "powers"] },
	{ handle: "geometry", title: "Geometry", aliases: ["shapes", "area", "perimeter"] },
	{ handle: "fractions", title: "Fractions", aliases: ["fraction", "rational"] }
];
