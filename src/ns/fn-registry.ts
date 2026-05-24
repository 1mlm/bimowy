import z from "zod";

// Generic interface captures the relationship between inputs/output/execute
export type BasicFunction<
	In extends z.ZodArray | z.ZodTuple = z.ZodArray<z.ZodUnknown> | z.ZodTuple,
	Out extends z.ZodType = z.ZodType
> = {
	id: string;
	inputs: In; // Zod schema available at runtime
	output: Out; // Zod schema available at runtime
	execute: (...args: z.infer<In>) => z.infer<Out>; // Typed function at compile-time
};

// Basic Function creator - preserves generic relationship
function $<In extends z.ZodArray | z.ZodTuple, Out extends z.ZodType>({
	id,
	inputs,
	output,
	execute
}: {
	id: string;
	inputs: In;
	output: Out;
	execute: (...args: z.infer<In>) => z.infer<Out>;
}): BasicFunction<In, Out> {
	return { id, inputs, output, execute };
}

const randomFunction = $({
	id: "random",
	inputs: z.tuple([z.enum(["int", "float"]), z.number(), z.number()]),
	output: z.number(),
	execute: (type, min, max) => {
		const randomFloat = Math.random() * (max - min + 1);
		if (type === "int") return Math.floor(randomFloat) + min;
		return randomFloat + min;
	}
});

const basicOperationsExecuters = {
	"+": (a, b) => a + b,
	"-": (a, b) => a - b,
	"*": (a, b) => a * b,
	"/": (a, b) => a / b,
	"**": (a, b) => a ** b
} satisfies Record<string, (a: number, b: number) => number>;

type BasicOperator = keyof typeof basicOperationsExecuters;

function assertIsOperator(op: string): asserts op is BasicOperator {
	if (!(op in basicOperationsExecuters)) {
		throw new Error(`Invalid operator: ${op}`);
	}
}

export const basicOperationFunction = $({
	id: "op",
	inputs: z.tuple([
		z.enum(Object.keys(basicOperationsExecuters) as [string, ...string[]]),
		z.number(),
		z.number()
	]),
	output: z.number(),
	execute: (op, a, b) => {
		assertIsOperator(op);
		return basicOperationsExecuters[op](a, b);
	}
});

const basicComparisonExecuters = {
	"=": (a, b) => a === b,
	">": (a, b) => a > b,
	"<": (a, b) => a < b,
	">=": (a, b) => a >= b,
	"<=": (a, b) => a <= b,
	"!=": (a, b) => a !== b
	// } satisfies Record<string, <T>(a: T, b: T) => boolean>;
} satisfies Record<string, (a: number, b: number) => boolean>;

type ComparisonOperator = keyof typeof basicComparisonExecuters;

function assertIsComparisonOperator(op: string): asserts op is ComparisonOperator {
	if (!(op in basicComparisonExecuters)) {
		throw new Error(`Invalid comparison operator: ${op}`);
	}
}

export const basicComparisonFunction = $({
	id: "compare",
	inputs: z.tuple([
		z.enum(Object.keys(basicComparisonExecuters) as [string, ...string[]]),
		z.number(),
		z.number()
	]),
	output: z.boolean(),
	execute: (op, a, b) => {
		assertIsComparisonOperator(op);
		return basicComparisonExecuters[op](a, b);
	}
});

export const otherFunctions = [
	$({
		id: "concat",
		inputs: z.array(z.union([z.string(), z.number()])),
		output: z.string(),
		execute: (...strs) => strs.map((str) => `${str}`.trim()).join(" ")
	}),
	$({
		id: "round",
		inputs: z.tuple([z.number()]),
		output: z.number(),
		execute: (n) => Math.round(n)
	}),
	$({
		id: "floor",
		inputs: z.tuple([z.number()]),
		output: z.number(),
		execute: (n) => Math.floor(n)
	}),
	$({
		id: "abs",
		inputs: z.tuple([z.number()]),
		output: z.number(),
		execute: (n) => Math.abs(n)
	}),
	$({
		id: "mod",
		inputs: z.tuple([z.number(), z.number()]),
		output: z.number(),
		execute: (a, b) => a % b
	})
] as const;

export const basicFunctionRegistry = [
	randomFunction,
	basicOperationFunction,
	basicComparisonFunction,
	...otherFunctions
] as BasicFunction[];

export function getBasicFunctionById(id: string): BasicFunction | undefined {
	return basicFunctionRegistry.find((fn) => fn.id === id);
}
