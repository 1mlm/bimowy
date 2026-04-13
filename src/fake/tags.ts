export type V2FakeTag = {
	handle: string;
	name: string;
	aliases: string[];
};

export const V2_FAKE_TAGS: V2FakeTag[] = [
	{ handle: "math", name: "Math", aliases: ["mathematics"] },
	{ handle: "arithmetic", name: "Arithmetic", aliases: ["calc"] },
	{ handle: "algebra", name: "Algebra", aliases: ["exponents", "powers"] }
];
