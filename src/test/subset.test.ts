import z, { type ZodType } from "zod";
import { isSchemaSubset } from "@/ns/util/subset";
import { $group } from "./util-test";

const APPLE = z.literal("apple");
const BANANA = z.literal("banana");
const APPLE_BANANA = z.union([APPLE, BANANA]);
const JUST_STRING = z.string();
const STRING_BANANA = z.union([JUST_STRING, BANANA]);

const LITERAL42 = z.literal(42);
const LITERAL43 = z.literal(43);
const LITERAL0 = z.literal(0);
const JUST_NUMBER = z.number();
const NUMBER_42_43 = z.union([LITERAL42, LITERAL43]);

const TRUE = z.literal(true);
const FALSE = z.literal(false);
const JUST_BOOLEAN = z.boolean();
const TRUE_FALSE = z.union([TRUE, FALSE]);
const INTERSECTION_APPLE_42 = z.intersection(APPLE, LITERAL42);

const STRING_OR_NUMBER = z.union([JUST_STRING, JUST_NUMBER]);
const APPLE_OR_42 = z.union([APPLE, LITERAL42]);
const STRING_NUMBER_BOOL = z.union([JUST_STRING, JUST_NUMBER, JUST_BOOLEAN]);
const INTERSECTION_STRING_NUMBER = z.intersection(JUST_STRING, JUST_NUMBER);

const subsetTestCases = [
	{
		name: "Strings",
		cases: [
			[true, APPLE, APPLE],
			[false, APPLE, BANANA],
			[true, APPLE_BANANA, APPLE],
			[true, APPLE_BANANA, BANANA],
			[false, APPLE_BANANA, JUST_STRING],
			[true, JUST_STRING, APPLE],
			[true, JUST_STRING, STRING_BANANA],
			[false, BANANA, JUST_STRING],
			[true, STRING_BANANA, BANANA],
			[true, STRING_BANANA, STRING_BANANA]
		]
	},
	{
		name: "Numbers",
		cases: [
			[true, LITERAL42, LITERAL42],
			[false, LITERAL42, LITERAL43],
			[false, LITERAL42, JUST_NUMBER],
			[true, JUST_NUMBER, LITERAL42],
			[true, JUST_NUMBER, NUMBER_42_43],
			[false, NUMBER_42_43, JUST_NUMBER],
			[true, NUMBER_42_43, LITERAL42],
			[true, NUMBER_42_43, LITERAL43],
			[false, NUMBER_42_43, LITERAL0]
		]
	},
	{
		name: "Booleans",
		cases: [
			[true, TRUE, TRUE],
			[false, TRUE, FALSE],
			[false, TRUE, JUST_BOOLEAN],
			[true, JUST_BOOLEAN, TRUE],
			[true, JUST_BOOLEAN, FALSE],
			[true, JUST_BOOLEAN, TRUE_FALSE],
			[false, TRUE_FALSE, JUST_BOOLEAN],
			[true, TRUE_FALSE, TRUE],
			[true, TRUE_FALSE, FALSE],
			[false, TRUE_FALSE, APPLE]
		]
	},
	{
		name: "Mix",
		cases: [
			[false, INTERSECTION_APPLE_42, APPLE],
			[false, INTERSECTION_APPLE_42, LITERAL42],
			[true, STRING_OR_NUMBER, APPLE],
			[true, STRING_OR_NUMBER, LITERAL42],
			[false, STRING_OR_NUMBER, TRUE],
			[true, STRING_NUMBER_BOOL, APPLE],
			[true, STRING_NUMBER_BOOL, LITERAL42],
			[true, STRING_NUMBER_BOOL, TRUE],
			[false, APPLE_OR_42, JUST_STRING],
			[false, APPLE_OR_42, JUST_NUMBER],
			[true, APPLE_OR_42, APPLE],
			[true, APPLE_OR_42, LITERAL42],
			[false, APPLE_OR_42, BANANA],
			[false, INTERSECTION_STRING_NUMBER, JUST_STRING],
			[false, INTERSECTION_STRING_NUMBER, JUST_NUMBER]
		]
	}
] as { name: string; cases: [boolean, ZodType, ZodType][] }[];

$group(
	"isSchemaSubset",
	subsetTestCases.map(({ name, cases }) => ({
		name,
		items: cases.map(([expected, main, input]) => ({
			expected,
			actual: () => isSchemaSubset(main, input)
		}))
	}))
);
