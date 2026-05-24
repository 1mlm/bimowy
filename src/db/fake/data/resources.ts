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
				// correctionPlan: answer === max(a, b)
				correctionPlan: $ns.fn.newNReturn(
					$ns.fn.getNRun("compare", [
						"=",
						answer,
						$ns.cond(
							$ns.fn.getNRun("compare", [">", field("a"), field("b")]),
							field("a"),
							field("b")
						)
					])
				)
			})
		)
	}
];
