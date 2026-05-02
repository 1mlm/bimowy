import { executeNS } from "@/ns/execute";
import { $ns } from "@/ns/util/helpers";
import { $group, type TestItem } from "./util-test";

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
			{ expected: 15, actual: () => executeNS($ns.fn.getNRun("op", ["+", 5, 10])) },
			{ expected: 16, actual: () => executeNS($ns.fn.getNRun("op", ["-", 20, 4])) },
			{ expected: 12, actual: () => executeNS($ns.fn.getNRun("op", ["*", 3, 4])) },
			{ expected: 5, actual: () => executeNS($ns.fn.getNRun("op", ["/", 10, 2])) }
		]
	},

	{
		name: "Comparison",
		items: [
			{ expected: true, actual: () => executeNS($ns.fn.getNRun("compare", [">", 10, 5])) },
			{ expected: false, actual: () => executeNS($ns.fn.getNRun("compare", [">", 5, 10])) },
			{ expected: true, actual: () => executeNS($ns.fn.getNRun("compare", ["=", 7, 7])) }
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
					executeNS($ns.cond($ns.fn.getNRun("compare", [">", 10, 5]), "bigger", "smaller"))
			}
		]
	},

	{
		name: "Custom functions",
		items: [
			{
				expected: 42,
				actual: () => executeNS($ns.fn.run($ns.fn.new(["x"], [$ns.rtrn($ns.var.get("x"))]), [42]))
			},
			{
				expected: 11,
				actual: () =>
					executeNS(
						$ns.fn.run(
							$ns.fn.new(
								["a", "b"],
								[$ns.rtrn($ns.fn.getNRun("op", ["+", $ns.var.get("a"), $ns.var.get("b")]))]
							),
							[5, 6]
						)
					)
			}
		]
	},
	{
		name: "UI",
		items: [
			{
				name: "ui.text executes arithmetic payload",
				expected: 15,
				actual: () => executeNS($ns.ui.text($ns.fn.getNRun("op", ["+", 7, 8])))
			},
			{
				name: "ui.prgh executes all item payloads",
				expected: ["sum:", 8, "ok"],
				actual: () =>
					executeNS(
						$ns.ui.prgh([
							$ns.ui.text("sum:"),
							$ns.ui.text($ns.fn.getNRun("op", ["+", 3, 5])),
							$ns.ui.text($ns.cond(true, "ok", "nope"))
						])
					)
			},
			{
				name: "ui.input executes dynamic id",
				expected: { _nstype: "ui-input", id: "question-6" },
				actual: () =>
					executeNS(
						$ns.ui.input($ns.cond($ns.fn.getNRun("compare", [">", 6, 5]), "question-6", "bad"))
					)
			},
			{
				name: "ui.widget executes id and deep args",
				expected: { id: "plane", args: ["range", 0, 10, "meta", "x=", 4] },
				actual: () =>
					executeNS(
						$ns.ui.widget("plane", [
							"range",
							0,
							$ns.fn.getNRun("op", ["*", 2, 5]),
							"meta",
							"x=",
							$ns.fn.getNRun("op", ["+", 2, 2])
						])
					)
			},
			{
				name: "ui-prgh with nested closures and vars (hell mode)",
				expected: ["A:", 3, "B:", 12, "C:", "gt"],
				actual: () =>
					executeNS(
						$ns.fn.run(
							$ns.fn.new(
								["base"],
								[
									$ns.var.set("x", $ns.var.get("base")),
									$ns.rtrn(
										$ns.ui.prgh([
											$ns.ui.text("A:"),
											$ns.ui.text($ns.fn.getNRun("op", ["+", $ns.var.get("x"), 1])),
											$ns.ui.text("B:"),
											$ns.ui.text(
												$ns.fn.run(
													$ns.fn.new(
														["n"],
														[
															$ns.rtrn(
																$ns.fn.getNRun("op", ["*", $ns.var.get("n"), $ns.var.get("x")])
															)
														]
													),
													[6]
												)
											),
											$ns.ui.text("C:"),
											$ns.ui.text(
												$ns.cond($ns.fn.getNRun("compare", [">", $ns.var.get("x"), 1]), "gt", "le")
											)
										])
									)
								]
							),
							[2]
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
					executeNS($ns.fn.run($ns.fn.new(["a", "b"], [$ns.rtrn($ns.var.get("a"))]), [5])),
				shouldThrow: true
			},
			{
				name: "throws on malformed node",
				actual: () => executeNS({ _nstype: "unknown-node" }),
				shouldThrow: true
			},
			{
				name: "throws when basic function args are invalid",
				actual: () => executeNS($ns.fn.getNRun("op", ["+", "5", 2])),
				shouldThrow: true
			},
			{
				name: "throws when fn-run target is not a function",
				actual: () => executeNS($ns.fn.run(123, [])),
				shouldThrow: true
			},
			{
				name: "throws when custom function input names are not strings",
				actual: () => executeNS($ns.fn.run($ns.fn.new([1], [$ns.rtrn(1)]), [7])),
				shouldThrow: true
			},
			{
				name: "throws when custom function instructions are not an array",
				actual: () => executeNS($ns.fn.run($ns.fn.new(["x"], $ns.rtrn($ns.var.get("x"))), [7])),
				shouldThrow: true
			}
		]
	}
	// TODO: throwable UI nodes
] satisfies TestItem[];

$group("executeNS", executeTestCases);
