import { executeNS } from "@/ns/execute";
import { $ } from "@/ns/helpers";
import { $group } from "./util";

const executeTestCases = [
	// Primitives
	[42, 42],
	["hello", "hello"],
	[true, true],
	[null, null],

	// Arrays
	[
		[1, 2, 3],
		[1, 2, 3]
	],
	[
		["a", "b"],
		["a", "b"]
	],

	// Function calls - arithmetic
	[15, $.basicFnRun("op", ["+", 5, 10])],
	[16, $.basicFnRun("op", ["-", 20, 4])],
	[12, $.basicFnRun("op", ["*", 3, 4])],
	[5, $.basicFnRun("op", ["/", 10, 2])],

	// Function calls - comparison
	[true, $.basicFnRun("compare", [">", 10, 5])],
	[false, $.basicFnRun("compare", [">", 5, 10])],
	[true, $.basicFnRun("compare", ["=", 7, 7])],

	// If statements
	["yes", $.cond(true, { yes: "yes", no: "no" })],
	["no", $.cond(false, { yes: "yes", no: "no" })],
	[
		"bigger",
		$.cond($.basicFnRun("compare", [">", 10, 5]), {
			yes: "bigger",
			no: "smaller"
		})
	],

	// Custom function calls - expected input binding behavior
	[42, $.fnRun($.fnCreate(["x"], [$.rtrn($.varGet("x"))]), [42])],
	[
		11,
		$.fnRun(
			$.fnCreate(["a", "b"], [$.rtrn($.basicFnRun("op", ["+", $.varGet("a"), $.varGet("b")]))]),
			[5, 6]
		)
	]
] satisfies [unknown, unknown][];

$group(
	"executeNS",
	executeTestCases.map(([expected, program]) => [expected, () => executeNS(program)])
);
