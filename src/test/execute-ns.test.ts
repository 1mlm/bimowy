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
	[15, $.fn("op", ["+", 5, 10])],
	[16, $.fn("op", ["-", 20, 4])],
	[12, $.fn("op", ["*", 3, 4])],
	[5, $.fn("op", ["/", 10, 2])],

	// Function calls - comparison
	[true, $.fn("compare", [">", 10, 5])],
	[false, $.fn("compare", [">", 5, 10])],
	[true, $.fn("compare", ["=", 7, 7])],

	// If statements
	["yes", $.if(true, { yes: "yes", no: "no" })],
	["no", $.if(false, { yes: "yes", no: "no" })],
	[
		"bigger",
		$.if($.fn("compare", [">", 10, 5]), {
			yes: "bigger",
			no: "smaller"
		})
	]
] satisfies [unknown, unknown][];

$group(
	"executeNS",
	executeTestCases.map(([expected, program]) => [expected, () => executeNS(program)])
);
