import { executeNS } from "@/ns/execute";
import { $ns } from "@/ns/helpers";
import { $group, type TestItem } from "./index.test";

const executeTestCases = [
	{
		name: "Primitives",
		items: [
			{ expected: 42, actual: () => executeNS(42) },
			{ expected: "hello", actual: () => executeNS("hello") },
			{ expected: true, actual: () => executeNS(true) },
			{ expected: null, actual: () => executeNS(null) }
		]
	},

	{
		name: "Arrats",
		items: [
			{ expected: [1, 2, 3], actual: () => executeNS([1, 2, 3]) },
			{ expected: ["a", "b"], actual: () => executeNS(["a", "b"]) }
		]
	},
	{
		name: "Arithmetic",
		items: [
			{ expected: 15, actual: () => executeNS($ns.fnGetNRun("op", ["+", 5, 10])) },
			{ expected: 16, actual: () => executeNS($ns.fnGetNRun("op", ["-", 20, 4])) },
			{ expected: 12, actual: () => executeNS($ns.fnGetNRun("op", ["*", 3, 4])) },
			{ expected: 5, actual: () => executeNS($ns.fnGetNRun("op", ["/", 10, 2])) }
		]
	},

	{
		name: "Comparison",
		items: [
			{ expected: true, actual: () => executeNS($ns.fnGetNRun("compare", [">", 10, 5])) },
			{ expected: false, actual: () => executeNS($ns.fnGetNRun("compare", [">", 5, 10])) },
			{ expected: true, actual: () => executeNS($ns.fnGetNRun("compare", ["=", 7, 7])) }
		]
	},

	{
		name: "If",
		items: [
			{ expected: "yes", actual: () => executeNS($ns.cond(true, "yes", "no")) },
			{ expected: "no", actual: () => executeNS($ns.cond(false, "yes", "no")) },
			{
				expected: "bigger",
				actual: () =>
					executeNS($ns.cond($ns.fnGetNRun("compare", [">", 10, 5]), "bigger", "smaller"))
			}
		]
	},

	{
		name: "Custom functions",
		items: [
			{
				expected: 42,
				actual: () => executeNS($ns.fnRun($ns.fnCreate(["x"], [$ns.rtrn($ns.varGet("x"))]), [42]))
			},
			{
				expected: 11,
				actual: () =>
					executeNS(
						$ns.fnRun(
							$ns.fnCreate(
								["a", "b"],
								[$ns.rtrn($ns.fnGetNRun("op", ["+", $ns.varGet("a"), $ns.varGet("b")]))]
							),
							[5, 6]
						)
					)
			}
		]
	},
	{
		name: "Throwables",
		items: [
			{
				actual: () =>
					executeNS($ns.fnRun($ns.fnCreate(["a", "b"], [$ns.rtrn($ns.varGet("a"))]), [5])),
				shouldThrow: true
			},
			{
				name: "throws on malformed node",
				actual: () => executeNS({ _nstype: "unknown-node" }),
				shouldThrow: true
			},
			{
				name: "throws when basic function args are invalid",
				actual: () => executeNS($ns.fnGetNRun("op", ["+", "5", 2])),
				shouldThrow: true
			},
			{
				name: "throws when fn-run target is not a function",
				actual: () => executeNS($ns.fnRun(123, [])),
				shouldThrow: true
			},
			{
				name: "throws when custom function input names are not strings",
				actual: () => executeNS($ns.fnRun($ns.fnCreate([1], [$ns.rtrn(1)]), [7])),
				shouldThrow: true
			},
			{
				name: "throws when custom function instructions are not an array",
				actual: () => executeNS($ns.fnRun($ns.fnCreate(["x"], $ns.rtrn($ns.varGet("x"))), [7])),
				shouldThrow: true
			}
		]
	}
] satisfies TestItem[];

$group("executeNS", executeTestCases);
