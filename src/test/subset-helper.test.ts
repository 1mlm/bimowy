import z from "zod";
import {
	isBooleanLiteralSchema,
	isBooleanSchema,
	isIntersectionSchema,
	isLiteralSchema,
	isNeverSchema,
	isNumberLiteralSchema,
	isNumberSchema,
	isStringLiteralSchema,
	isStringSchema,
	isUnionSchema,
	isWhateverSchema
} from "@/ns/util/subset.util";
import { $group } from "./util-test";

const subsetHelperTestCases = [
	{
		helper: isStringSchema,
		cases: [
			[true, z.string()],
			[true, z.string().min(2)],
			[true, z.string().regex(/^[a-z]+$/)],
			[true, z.literal("ok")],
			[true, z.literal("ok2")],
			[true, z.literal("line\nbreak")],
			[true, z.literal(" ")],
			[false, z.literal(2)],
			[false, z.literal(true)],
			[false, z.literal(false)],
			[true, z.literal("")],
			[false, z.literal(0)],
			[false, z.union([z.string(), z.literal("x")])],
			[false, z.string().optional()],
			[false, z.string().nullable()],
			[false, null],
			[false, { type: "string" }]
		]
	},
	{
		helper: isNumberSchema,
		cases: [
			[true, z.number()],
			[true, z.number().int()],
			[true, z.number().finite().nonnegative()],
			[false, z.literal(42)],
			[false, z.literal(Number.NaN)],
			[false, z.literal("42")],
			[false, z.string()],
			[false, z.boolean()],
			[false, z.number().optional()],
			[false, z.intersection(z.number(), z.literal(3))],
			[false, undefined],
			[false, { type: "number", def: {} }]
		]
	},
	{
		helper: isBooleanSchema,
		cases: [
			[true, z.boolean()],
			[true, z.boolean().refine((v) => v)],
			[false, z.literal(true)],
			[false, z.literal(false)],
			[false, z.string()],
			[false, z.number()],
			[false, z.boolean().optional()],
			[false, z.union([z.boolean(), z.literal(false)])],
			[false, 0],
			[false, { type: "boolean" }]
		]
	},
	{
		helper: isLiteralSchema,
		cases: [
			[true, z.literal("str")],
			[true, z.literal(42)],
			[true, z.literal(Number.NaN)],
			[true, z.literal(-0)],
			[true, z.literal(true)],
			[true, z.literal(false)],
			[true, z.literal("")],
			[true, z.literal(0)],
			[false, z.string()],
			[false, z.number()],
			[false, z.boolean()],
			[false, z.union([z.literal("a"), z.literal("b")])],
			[false, false],
			[false, true],
			[false, { value: "str", type: "literal" }]
		]
	},
	{
		helper: isStringLiteralSchema,
		cases: [
			[true, z.literal("hello")],
			[true, z.literal("")],
			[true, z.literal("0")],
			[true, z.literal("line\\nbreak")],
			[false, z.literal(0)],
			[false, z.literal(42)],
			[false, z.literal(true)],
			[false, z.string()],
			[false, z.number()],
			[false, z.literal(null)],
			[false, z.literal(undefined)],
			[false, "hello"]
		]
	},
	{
		helper: isNumberLiteralSchema,
		cases: [
			[true, z.literal(42)],
			[true, z.literal(0)],
			[true, z.literal(-1)],
			[true, z.literal(Number.NaN)],
			[true, z.literal(Number.POSITIVE_INFINITY)],
			[true, z.literal(-0)],
			[false, z.literal("42")],
			[false, z.literal(true)],
			[false, z.number()],
			[false, z.string()],
			[false, z.literal(BigInt(42))],
			[false, z.union([z.literal(1), z.literal(2)])],
			[false, Number.NaN]
		]
	},
	{
		helper: isBooleanLiteralSchema,
		cases: [
			[true, z.literal(true)],
			[true, z.literal(false)],
			[false, z.literal(1)],
			[false, z.literal(0)],
			[false, z.literal("true")],
			[false, z.boolean()],
			[false, z.string()],
			[false, z.literal(null)],
			[false, z.union([z.literal(true), z.literal(false)])],
			[false, true]
		]
	},
	{
		helper: isUnionSchema,
		cases: [
			[true, z.union([z.string(), z.number()])],
			[true, z.union([z.literal("a"), z.literal("b")])],
			[true, z.union([z.union([z.string(), z.number()]), z.boolean()])],
			[true, z.union([z.literal(Number.NaN), z.literal(Infinity)])],
			[false, z.string()],
			[false, z.number()],
			[false, z.literal("a")],
			[false, z.intersection(z.string(), z.literal("a"))],
			[false, z.union([z.string(), z.number()]).optional()],
			[false, []],
			[false, { type: "union", options: [z.string(), z.number()] }]
		]
	},
	{
		helper: isIntersectionSchema,
		cases: [
			[true, z.intersection(z.string(), z.literal("a"))],
			[true, z.intersection(z.number(), z.literal(42))],
			[true, z.intersection(z.union([z.string(), z.number()]), z.literal("x"))],
			[true, z.intersection(z.object({ id: z.number() }), z.object({ name: z.string() }))],
			[false, z.union([z.string(), z.number()])],
			[false, z.string()],
			[false, z.number()],
			[false, z.intersection(z.string(), z.literal("a")).optional()],
			[false, { left: z.string(), right: z.number() }],
			[false, "intersection"]
		]
	},
	{
		helper: isWhateverSchema,
		cases: [
			[true, z.any()],
			[true, z.unknown()],
			[true, z.union([z.any(), z.unknown()]).options[0]],
			[false, z.string()],
			[false, z.number()],
			[false, z.boolean()],
			[false, z.literal("any")],
			[false, z.never()],
			[false, z.any().optional()],
			[false, { type: "any" }],
			[false, "unknown"]
		]
	},
	{
		helper: isNeverSchema,
		cases: [
			[true, z.never()],
			[true, z.union([z.never(), z.never()]).options[0]],
			[false, z.any()],
			[false, z.unknown()],
			[false, z.string()],
			[false, z.void()],
			[false, z.never().optional()],
			[false, null],
			[false, { type: "never" }]
		]
	}
] as { helper: (schema: unknown) => boolean; cases: [boolean, unknown][] }[];

$group(
	"isSchemaSubset Helpers",
	subsetHelperTestCases.map(({ helper, cases }) => ({
		name: helper.name,
		items: cases.map(([expected, schema]) => ({
			expected,
			actual: () => helper(schema)
		}))
	}))
);
