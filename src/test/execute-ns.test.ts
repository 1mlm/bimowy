import { executeNS } from "@/ns/execute";
import { $ } from "@/ns/helpers";
import { $group, type TestCase } from "./util";

const executeTestCases = [
	// Primitives
	{ expected: 42, actual: () => executeNS(42) },
	{ expected: "hello", actual: () => executeNS("hello") },
	{ expected: true, actual: () => executeNS(true) },
	{ expected: null, actual: () => executeNS(null) },

	// Arrays
	{ expected: [1, 2, 3], actual: () => executeNS([1, 2, 3]) },
	{ expected: ["a", "b"], actual: () => executeNS(["a", "b"]) },

	// Function calls - arithmetic
	{ expected: 15, actual: () => executeNS($.basicFnRun("op", ["+", 5, 10])) },
	{ expected: 16, actual: () => executeNS($.basicFnRun("op", ["-", 20, 4])) },
	{ expected: 12, actual: () => executeNS($.basicFnRun("op", ["*", 3, 4])) },
	{ expected: 5, actual: () => executeNS($.basicFnRun("op", ["/", 10, 2])) },

	// Function calls - comparison
	{ expected: true, actual: () => executeNS($.basicFnRun("compare", [">", 10, 5])) },
	{ expected: false, actual: () => executeNS($.basicFnRun("compare", [">", 5, 10])) },
	{ expected: true, actual: () => executeNS($.basicFnRun("compare", ["=", 7, 7])) },

	// If statements
	{ expected: "yes", actual: () => executeNS($.cond(true, { yes: "yes", no: "no" })) },
	{ expected: "no", actual: () => executeNS($.cond(false, { yes: "yes", no: "no" })) },
	{
		expected: "bigger",
		actual: () =>
			executeNS(
				$.cond($.basicFnRun("compare", [">", 10, 5]), {
					yes: "bigger",
					no: "smaller"
				})
			)
	},

	// Custom function calls - expected input binding behavior
	{
		expected: 42,
		actual: () => executeNS($.fnRun($.fnCreate(["x"], [$.rtrn($.varGet("x"))]), [42]))
	},
	{
		expected: 11,
		actual: () =>
			executeNS(
				$.fnRun(
					$.fnCreate(["a", "b"], [$.rtrn($.basicFnRun("op", ["+", $.varGet("a"), $.varGet("b")]))]),
					[5, 6]
				)
			)
	},
	{
		actual: () => executeNS($.fnRun($.fnCreate(["a", "b"], [$.rtrn($.varGet("a"))]), [5])),
		shouldThrow: true
	},
	{
		name: "throws on malformed node",
		actual: () => executeNS({ _nstype: "unknown-node" }),
		shouldThrow: true
	},
	{
		name: "throws when basic function args are invalid",
		actual: () => executeNS($.basicFnRun("op", ["+", "5", 2])),
		shouldThrow: true
	},
	{
		name: "throws when fn-run target is not a function",
		actual: () => executeNS($.fnRun(123, [])),
		shouldThrow: true
	},
	{
		name: "throws when custom function input names are not strings",
		actual: () => executeNS($.fnRun($.fnCreate([1], [$.rtrn(1)]), [7])),
		shouldThrow: true
	},
	{
		name: "throws when custom function instructions are not an array",
		actual: () => executeNS($.fnRun($.fnCreate(["x"], $.rtrn($.varGet("x"))), [7])),
		shouldThrow: true
	}
] satisfies TestCase[];

$group("executeNS", executeTestCases);
