import z, { type ZodType } from "zod";
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
} from "@/ns/subset.util";
import { $group } from "./index.test";

const subsetHelperTestCases = [
	{
		helper: isStringSchema,
		cases: [
			[true, z.string()],
			[true, z.literal("ok")],
			[true, z.literal("ok2")],
			[false, z.literal(2)],
			[false, z.literal(true)],
			[false, z.literal(false)],
			[true, z.literal("")],
			[false, z.literal(0)]
		]
	},
	{
		helper: isNumberSchema,
		cases: [
			[true, z.number()],
			[false, z.literal(42)],
			[false, z.literal("42")],
			[false, z.string()],
			[false, z.boolean()]
		]
	},
	{
		helper: isBooleanSchema,
		cases: [
			[true, z.boolean()],
			[false, z.literal(true)],
			[false, z.literal(false)],
			[false, z.string()],
			[false, z.number()]
		]
	},
	{
		helper: isLiteralSchema,
		cases: [
			[true, z.literal("str")],
			[true, z.literal(42)],
			[true, z.literal(true)],
			[true, z.literal(false)],
			[true, z.literal("")],
			[true, z.literal(0)],
			[false, z.string()],
			[false, z.number()],
			[false, z.boolean()]
		]
	},
	{
		helper: isStringLiteralSchema,
		cases: [
			[true, z.literal("hello")],
			[true, z.literal("")],
			[false, z.literal(0)],
			[false, z.literal(42)],
			[false, z.literal(true)],
			[false, z.string()],
			[false, z.number()]
		]
	},
	{
		helper: isNumberLiteralSchema,
		cases: [
			[true, z.literal(42)],
			[true, z.literal(0)],
			[true, z.literal(-1)],
			[false, z.literal("42")],
			[false, z.literal(true)],
			[false, z.number()],
			[false, z.string()]
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
			[false, z.string()]
		]
	},
	{
		helper: isUnionSchema,
		cases: [
			[true, z.union([z.string(), z.number()])],
			[true, z.union([z.literal("a"), z.literal("b")])],
			[false, z.string()],
			[false, z.number()],
			[false, z.literal("a")]
		]
	},
	{
		helper: isIntersectionSchema,
		cases: [
			[true, z.intersection(z.string(), z.literal("a"))],
			[true, z.intersection(z.number(), z.literal(42))],
			[false, z.union([z.string(), z.number()])],
			[false, z.string()],
			[false, z.number()]
		]
	},
	{
		helper: isWhateverSchema,
		cases: [
			[true, z.any()],
			[true, z.unknown()],
			[false, z.string()],
			[false, z.number()],
			[false, z.boolean()],
			[false, z.literal("any")]
		]
	},
	{
		helper: isNeverSchema,
		cases: [
			[true, z.never()],
			[false, z.any()],
			[false, z.unknown()],
			[false, z.string()],
			[false, z.void()]
		]
	}
] as { helper: (schema: ZodType) => boolean; cases: [boolean, ZodType][] }[];

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
