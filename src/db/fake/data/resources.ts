import type { Prisma } from "@/db/generated/client";
import { SEED_VAR_NAME } from "@/ns/resource-types/exercise-template";
import { $ns } from "@/ns/util/helpers";

type FakeResource = Prisma.ResourceCreateArgs["data"];

export const FAKE_RESOURCES: FakeResource[] = [
	{
		handle: "addition",
		title: "Addition",
		aliases: ["addition", "add", "sum", "plus", "+"],
		desc: "Practice adding two numbers together.",
		beta: false,
		tags: { connect: [{ handle: "math" }, { handle: "arithmetic" }] },
		type: "TEMPLATE_EXERCISE",
		data: JSON.parse(
			JSON.stringify({
				exampleSeed: { a: 2, b: 3 },
				exampleAnswer: 5,
				seedGeneratorPlan: $ns.fn.newNReturn(
					$ns.obj.new({
						a: $ns.fn.getNRun("random", ["int", 0, 10]),
						b: $ns.fn.getNRun("random", ["int", 0, 10])
					})
				),
				uiPlan: [
					$ns.ui.prgh([
						"The sum of",
						$ns.obj.getField($ns.var.get(SEED_VAR_NAME), "a"),
						"and",
						$ns.obj.getField($ns.var.get(SEED_VAR_NAME), "b"),
						"is",
						$ns.ui.input("answer")
					])
				],
				solutionPlan: $ns.fn.newNReturn(
					$ns.fn.getNRun("op", [
						"+",
						$ns.obj.getField($ns.var.get(SEED_VAR_NAME), "a"),
						$ns.obj.getField($ns.var.get(SEED_VAR_NAME), "b")
					])
				)
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
						base: $ns.fn.getNRun("random", ["int", 2, 5]),
						exponent: $ns.fn.getNRun("random", ["int", 2, 4])
					})
				),
				uiPlan: [
					$ns.ui.prgh([
						"Compute",
						$ns.obj.getField($ns.var.get(SEED_VAR_NAME), "base"),
						"^",
						$ns.obj.getField($ns.var.get(SEED_VAR_NAME), "exponent"),
						"=",
						$ns.ui.input("answer")
					])
				],
				solutionPlan: $ns.fn.newNReturn(
					$ns.fn.getNRun("op", [
						"**",
						$ns.obj.getField($ns.var.get(SEED_VAR_NAME), "base"),
						$ns.obj.getField($ns.var.get(SEED_VAR_NAME), "exponent")
					])
				)
			})
		)
	}
];
