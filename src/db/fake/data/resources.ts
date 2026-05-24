import type { Prisma } from "@/db/generated/client";
import { ANSWER_VAR_NAME, SEED_VAR_NAME } from "@/ns/resource-types/exercise-template";
import { $ns } from "@/ns/util/helpers";

type FakeResource = Prisma.ResourceCreateArgs["data"];

const seed = $ns.var.get(SEED_VAR_NAME);
const field = (f: string) => $ns.obj.getField(seed, f);
const answer = $ns.var.get(ANSWER_VAR_NAME);

export const FAKE_RESOURCES: FakeResource[] = [
	{
		handle: "addition",
		title: "Addition",
		aliases: ["addition", "add", "sum", "plus", "+"],
		desc: "Practice adding two numbers together.",
		beta: true,
		tags: { connect: [{ handle: "math" }, { handle: "arithmetic" }] },
		type: "TEMPLATE_EXERCISE",
		data: JSON.parse(
			JSON.stringify({
				exampleSeed: { a: 2, b: 3 },
				exampleAnswer: 5,
				seedGeneratorPlan: $ns.fn.newNReturn(
					$ns.obj.new({
						a: $ns.fn.getNRun("random", ["int", 1, 20]),
						b: $ns.fn.getNRun("random", ["int", 1, 20])
					})
				),
				uiPlan: [
					$ns.ui.prgh(["The sum of", field("a"), "and", field("b"), "is", $ns.ui.input("answer")])
				],
				solutionPlan: $ns.fn.newNReturn($ns.fn.getNRun("op", ["+", field("a"), field("b")]))
			})
		)
	},
	{
		handle: "subtraction",
		title: "Subtraction",
		aliases: ["subtraction", "subtract", "minus", "difference", "-"],
		desc: "Practice subtracting numbers.",
		beta: true,
		tags: { connect: [{ handle: "math" }, { handle: "arithmetic" }] },
		type: "TEMPLATE_EXERCISE",
		data: JSON.parse(
			JSON.stringify({
				exampleSeed: { a: 9, b: 4 },
				exampleAnswer: 5,
				seedGeneratorPlan: $ns.fn.newNReturn(
					$ns.obj.new({
						a: $ns.fn.getNRun("random", ["int", 5, 30]),
						b: $ns.fn.getNRun("random", ["int", 1, 20])
					})
				),
				uiPlan: [$ns.ui.prgh([field("a"), "minus", field("b"), "equals", $ns.ui.input("answer")])],
				solutionPlan: $ns.fn.newNReturn($ns.fn.getNRun("op", ["-", field("a"), field("b")]))
			})
		)
	},
	{
		handle: "multiplication",
		title: "Multiplication",
		aliases: ["multiplication", "multiply", "times", "product", "×", "*"],
		desc: "Practice your multiplication tables.",
		beta: true,
		tags: { connect: [{ handle: "math" }, { handle: "arithmetic" }] },
		type: "TEMPLATE_EXERCISE",
		data: JSON.parse(
			JSON.stringify({
				exampleSeed: { a: 6, b: 7 },
				exampleAnswer: 42,
				seedGeneratorPlan: $ns.fn.newNReturn(
					$ns.obj.new({
						a: $ns.fn.getNRun("random", ["int", 2, 12]),
						b: $ns.fn.getNRun("random", ["int", 2, 12])
					})
				),
				uiPlan: [$ns.ui.prgh([field("a"), "×", field("b"), "=", $ns.ui.input("answer")])],
				solutionPlan: $ns.fn.newNReturn($ns.fn.getNRun("op", ["*", field("a"), field("b")]))
			})
		)
	},
	{
		handle: "division",
		title: "Division",
		aliases: ["division", "divide", "quotient", "÷", "/"],
		desc: "Practice integer division.",
		beta: true,
		tags: { connect: [{ handle: "math" }, { handle: "arithmetic" }] },
		type: "TEMPLATE_EXERCISE",
		data: JSON.parse(
			JSON.stringify({
				exampleSeed: { a: 24, b: 6 },
				exampleAnswer: 4,
				// Multi-step: generate b and quotient, compute a = b × quotient
				seedGeneratorPlan: $ns.fn.new(
					[],
					[
						$ns.var.set("b", $ns.fn.getNRun("random", ["int", 2, 10])),
						$ns.var.set("q", $ns.fn.getNRun("random", ["int", 2, 12])),
						$ns.rtrn(
							$ns.obj.new({
								b: $ns.var.get("b"),
								a: $ns.fn.getNRun("op", ["*", $ns.var.get("b"), $ns.var.get("q")])
							})
						)
					]
				),
				uiPlan: [$ns.ui.prgh([field("a"), "÷", field("b"), "=", $ns.ui.input("answer")])],
				solutionPlan: $ns.fn.newNReturn($ns.fn.getNRun("op", ["/", field("a"), field("b")]))
			})
		)
	},
	{
		handle: "powers",
		title: "Powers",
		aliases: ["powers", "power", "exponent", "exponents"],
		desc: "Practice powers and exponents.",
		beta: true,
		tags: { connect: [{ handle: "math" }, { handle: "algebra" }] },
		type: "TEMPLATE_EXERCISE",
		data: JSON.parse(
			JSON.stringify({
				exampleSeed: { base: 2, exponent: 3 },
				exampleAnswer: 8,
				seedGeneratorPlan: $ns.fn.newNReturn(
					$ns.obj.new({
						base: $ns.fn.getNRun("random", ["int", 2, 9]),
						exponent: $ns.fn.getNRun("random", ["int", 2, 4])
					})
				),
				uiPlan: [
					$ns.ui.prgh([
						"Compute",
						field("base"),
						"^",
						field("exponent"),
						"=",
						$ns.ui.input("answer")
					])
				],
				solutionPlan: $ns.fn.newNReturn(
					$ns.fn.getNRun("op", ["**", field("base"), field("exponent")])
				)
			})
		)
	},
	{
		handle: "square-roots",
		title: "Square Roots",
		aliases: ["square-root", "sqrt", "root"],
		desc: "Find the square root of perfect squares.",
		beta: true,
		tags: { connect: [{ handle: "math" }, { handle: "algebra" }] },
		type: "TEMPLATE_EXERCISE",
		data: JSON.parse(
			JSON.stringify({
				exampleSeed: { root: 4, square: 16 },
				exampleAnswer: 4,
				// Multi-step: generate root, compute square = root²
				seedGeneratorPlan: $ns.fn.new(
					[],
					[
						$ns.var.set("r", $ns.fn.getNRun("random", ["int", 2, 12])),
						$ns.rtrn(
							$ns.obj.new({
								root: $ns.var.get("r"),
								square: $ns.fn.getNRun("op", ["**", $ns.var.get("r"), 2])
							})
						)
					]
				),
				uiPlan: [$ns.ui.prgh(["√", field("square"), "=", $ns.ui.input("answer")])],
				solutionPlan: $ns.fn.newNReturn(field("root"))
			})
		)
	},
	{
		handle: "comparison",
		title: "Comparison",
		aliases: ["comparison", "compare", "greater", "less", "order"],
		desc: "Pick the greater of two numbers.",
		beta: true,
		tags: { connect: [{ handle: "math" }, { handle: "arithmetic" }] },
		type: "TEMPLATE_EXERCISE",
		data: JSON.parse(
			JSON.stringify({
				exampleSeed: { a: 7, b: 3 },
				exampleAnswer: 7,
				seedGeneratorPlan: $ns.fn.newNReturn(
					$ns.obj.new({
						a: $ns.fn.getNRun("random", ["int", 1, 50]),
						b: $ns.fn.getNRun("random", ["int", 1, 50])
					})
				),
				uiPlan: [
					$ns.ui.prgh(["Which is greater?", field("a"), "or", field("b")]),
					// Options are {value: number}: UIRenderer uses String(value) as label
					$ns.ui.choice("answer", [
						$ns.obj.new({ value: field("a") }),
						$ns.obj.new({ value: field("b") })
					])
				],
				// Return { answer: { is_correct, value } } so UIRenderer can highlight correct option
				correctionPlan: $ns.fn.new([], [
					$ns.var.set("_max", $ns.fn.getNRun("max", [field("a"), field("b")])),
					$ns.rtrn(
						$ns.obj.new({
							answer: $ns.obj.new({
								is_correct: $ns.fn.getNRun("compare", ["=", answer, $ns.var.get("_max")]),
								value: $ns.var.get("_max")
							})
						})
					)
				])
			})
		)
	},
	{
		handle: "even-or-odd",
		title: "Even or Odd",
		aliases: ["even", "odd", "parity"],
		desc: "Decide whether a number is even or odd.",
		beta: true,
		tags: { connect: [{ handle: "math" }, { handle: "arithmetic" }] },
		type: "TEMPLATE_EXERCISE",
		data: JSON.parse(
			JSON.stringify({
				exampleSeed: { n: 14 },
				exampleAnswer: 0,
				seedGeneratorPlan: $ns.fn.newNReturn(
					$ns.obj.new({ n: $ns.fn.getNRun("random", ["int", 2, 99]) })
				),
				uiPlan: [
					$ns.ui.prgh(["Is", field("n"), "even or odd?"]),
					$ns.ui.choice("answer", [
						$ns.obj.new({ label: "Even", value: 0 }),
						$ns.obj.new({ label: "Odd", value: 1 })
					])
				],
				// Return { answer: { is_correct, value } } so correct option highlights
				correctionPlan: $ns.fn.new([], [
					$ns.var.set("_parity", $ns.fn.getNRun("mod", [field("n"), 2])),
					$ns.rtrn(
						$ns.obj.new({
							answer: $ns.obj.new({
								is_correct: $ns.fn.getNRun("compare", ["=", answer, $ns.var.get("_parity")]),
								value: $ns.var.get("_parity")
							})
						})
					)
				])
			})
		)
	},
	{
		handle: "area-rectangle",
		title: "Rectangle Area",
		aliases: ["rectangle", "area", "width", "height"],
		desc: "Calculate the area of a rectangle.",
		beta: true,
		tags: { connect: [{ handle: "math" }, { handle: "geometry" }] },
		type: "TEMPLATE_EXERCISE",
		data: JSON.parse(
			JSON.stringify({
				exampleSeed: { w: 5, h: 3 },
				exampleAnswer: 15,
				seedGeneratorPlan: $ns.fn.newNReturn(
					$ns.obj.new({
						w: $ns.fn.getNRun("random", ["int", 2, 15]),
						h: $ns.fn.getNRun("random", ["int", 2, 15])
					})
				),
				uiPlan: [
					$ns.ui.prgh([
						"A rectangle with width",
						field("w"),
						"and height",
						field("h"),
						"has area",
						$ns.ui.input("answer")
					])
				],
				solutionPlan: $ns.fn.newNReturn($ns.fn.getNRun("op", ["*", field("w"), field("h")]))
			})
		)
	},
	{
		handle: "percentage",
		title: "Percentage",
		aliases: ["percentage", "percent", "%"],
		desc: "Find a percentage of a number.",
		beta: true,
		tags: { connect: [{ handle: "math" }, { handle: "arithmetic" }] },
		type: "TEMPLATE_EXERCISE",
		data: JSON.parse(
			JSON.stringify({
				exampleSeed: { pct: 20, base: 50 },
				exampleAnswer: 10,
				// pct = multiple of 10 (10–90), base = multiple of 10 (20–100) → integer answer
				seedGeneratorPlan: $ns.fn.newNReturn(
					$ns.obj.new({
						pct: $ns.fn.getNRun("op", ["*", $ns.fn.getNRun("random", ["int", 1, 9]), 10]),
						base: $ns.fn.getNRun("op", ["*", $ns.fn.getNRun("random", ["int", 2, 10]), 10])
					})
				),
				uiPlan: [
					$ns.ui.prgh([
						"What is",
						field("pct"),
						"percent of",
						field("base"),
						"?",
						$ns.ui.input("answer")
					])
				],
				solutionPlan: $ns.fn.newNReturn(
					$ns.fn.getNRun("op", ["/", $ns.fn.getNRun("op", ["*", field("pct"), field("base")]), 100])
				)
			})
		)
	},
	{
		handle: "missing-addend",
		title: "Missing Addend",
		aliases: ["missing", "addend", "unknown"],
		desc: "Find the missing number in an addition equation.",
		beta: true,
		tags: { connect: [{ handle: "math" }, { handle: "arithmetic" }] },
		type: "TEMPLATE_EXERCISE",
		data: JSON.parse(
			JSON.stringify({
				exampleSeed: { a: 5, b: 8, c: 13 },
				exampleAnswer: 5,
				// a is the hidden addend; c = a + b
				seedGeneratorPlan: $ns.fn.new([], [
					$ns.var.set("a", $ns.fn.getNRun("random", ["int", 1, 20])),
					$ns.var.set("b", $ns.fn.getNRun("random", ["int", 1, 20])),
					$ns.rtrn(
						$ns.obj.new({
							a: $ns.var.get("a"),
							b: $ns.var.get("b"),
							c: $ns.fn.getNRun("op", ["+", $ns.var.get("a"), $ns.var.get("b")])
						})
					)
				]),
				uiPlan: [
					$ns.ui.prgh([
						$ns.ui.input("answer"),
						"+",
						field("b"),
						"=",
						field("c")
					])
				],
				solutionPlan: $ns.fn.newNReturn(field("a"))
			})
		)
	},
	{
		handle: "fraction-of-number",
		title: "Fraction of a Number",
		aliases: ["fraction-of", "fraction of", "fraction"],
		desc: "Find a unit fraction of a whole number.",
		beta: true,
		tags: { connect: [{ handle: "math" }, { handle: "fractions" }] },
		type: "TEMPLATE_EXERCISE",
		data: JSON.parse(
			JSON.stringify({
				exampleSeed: { n: 1, d: 3, base: 12 },
				exampleAnswer: 4,
				seedGeneratorPlan: $ns.fn.new(
					[],
					[
						$ns.var.set("d", $ns.fn.getNRun("random", ["int", 2, 6])),
						$ns.var.set("mult", $ns.fn.getNRun("random", ["int", 2, 10])),
						$ns.rtrn(
							$ns.obj.new({
								n: 1,
								d: $ns.var.get("d"),
								base: $ns.fn.getNRun("op", ["*", $ns.var.get("d"), $ns.var.get("mult")])
							})
						)
					]
				),
				uiPlan: [
					$ns.ui.prgh([
						"What is",
						$ns.ui.widget("Fraction", $ns.obj.new({ numerator: 1, denominator: field("d") })),
						"of",
						field("base"),
						"?",
						$ns.ui.input("answer")
					])
				],
				solutionPlan: $ns.fn.newNReturn($ns.fn.getNRun("op", ["/", field("base"), field("d")]))
			})
		)
	},
	{
		handle: "fraction-comparison",
		title: "Compare Fractions",
		aliases: ["compare-fractions", "fraction comparison", "which fraction"],
		desc: "Identify which of two fractions is larger.",
		beta: true,
		tags: { connect: [{ handle: "math" }, { handle: "fractions" }] },
		type: "TEMPLATE_EXERCISE",
		data: JSON.parse(
			JSON.stringify({
				exampleSeed: { an: 1, ad: 2, bn: 1, bd: 3 },
				exampleAnswer: 0,
				seedGeneratorPlan: $ns.fn.newNReturn(
					$ns.obj.new({
						an: $ns.fn.getNRun("random", ["int", 1, 7]),
						ad: $ns.fn.getNRun("random", ["int", 2, 8]),
						bn: $ns.fn.getNRun("random", ["int", 1, 7]),
						bd: $ns.fn.getNRun("random", ["int", 2, 8])
					})
				),
				uiPlan: [
					$ns.ui.prgh([
						"Which fraction is larger?",
						$ns.ui.widget("Fraction", $ns.obj.new({ numerator: field("an"), denominator: field("ad") })),
						"or",
						$ns.ui.widget("Fraction", $ns.obj.new({ numerator: field("bn"), denominator: field("bd") }))
					]),
					$ns.ui.choice("answer", [
						$ns.obj.new({ label: $ns.fn.getNRun("concat", [field("an"), "/", field("ad")]), value: 0 }),
						$ns.obj.new({ label: $ns.fn.getNRun("concat", [field("bn"), "/", field("bd")]), value: 1 })
					])
				],
				correctionPlan: $ns.fn.new(
					[],
					[
						$ns.var.set("_a", $ns.fn.getNRun("op", ["/", field("an"), field("ad")])),
						$ns.var.set("_b", $ns.fn.getNRun("op", ["/", field("bn"), field("bd")])),
						$ns.var.set(
							"_winner",
							$ns.cond($ns.fn.getNRun("compare", [">", $ns.var.get("_a"), $ns.var.get("_b")]), 0, 1)
						),
						$ns.rtrn(
							$ns.obj.new({
								answer: $ns.obj.new({
									is_correct: $ns.fn.getNRun("compare", ["=", answer, $ns.var.get("_winner")]),
									value: $ns.var.get("_winner")
								})
							})
						)
					]
				)
			})
		)
	},
	{
		handle: "rounding",
		title: "Rounding",
		aliases: ["round", "rounding", "nearest ten"],
		desc: "Round a number to the nearest 10.",
		beta: true,
		tags: { connect: [{ handle: "math" }, { handle: "arithmetic" }] },
		type: "TEMPLATE_EXERCISE",
		data: JSON.parse(
			JSON.stringify({
				exampleSeed: { n: 47 },
				exampleAnswer: 50,
				// n = 10–19, 21–29, ..., 91–99 (never a multiple of 10)
				seedGeneratorPlan: $ns.fn.newNReturn(
					$ns.obj.new({
						n: $ns.fn.getNRun("op", [
							"+",
							$ns.fn.getNRun("op", ["*", $ns.fn.getNRun("random", ["int", 1, 9]), 10]),
							$ns.fn.getNRun("random", ["int", 1, 9])
						])
					})
				),
				uiPlan: [
					$ns.ui.prgh(["Round", field("n"), "to the nearest 10:", $ns.ui.input("answer")])
				],
				// round(n / 10) * 10
				solutionPlan: $ns.fn.newNReturn(
					$ns.fn.getNRun("op", [
						"*",
						$ns.fn.getNRun("round", [$ns.fn.getNRun("op", ["/", field("n"), 10])]),
						10
					])
				)
			})
		)
	}
];
