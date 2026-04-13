import type { NSNode } from "@/ns/nodes";
import type { ExerciseTemplateResource } from "@/ns/resource-types/exercise-template";
import { SEED_VAR_NAME } from "@/ns/resource-types/exercise-template";
import { $ns } from "@/ns/util/helpers";

export type V2FakeExercise = {
	handle: string;
	title: string;
	aliases: string[];
	desc: string;
	beta: boolean;
	tags: string[];
	data: ExerciseTemplateResource["data"];
};

function buildFactorialSolution(seed: NSNode): NSNode {
	const results = [1, 1, 2, 6, 24, 120, 720] as const;
	let expression: NSNode = results[results.length - 1];
	for (let index = results.length - 2; index >= 0; index -= 1) {
		expression = $ns.cond(
			$ns.fn.getNRun("compare", ["=", seed, index]),
			results[index],
			expression
		);
	}
	return expression;
}

export const V2_FAKE_EXERCISES: V2FakeExercise[] = [
	{
		handle: "addition",
		title: "Addition",
		aliases: ["addition", "add", "sum", "plus", "+"],
		desc: "Practice adding two numbers together.",
		beta: true,
		tags: ["math", "arithmetic"],
		data: {
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
		}
	},
	{
		handle: "factorial",
		title: "Factorial",
		aliases: ["factorial", "!"],
		desc: "Practice factorials.",
		beta: true,
		tags: ["math", "arithmetic"],
		data: {
			exampleSeed: 5,
			exampleAnswer: 120,
			seedGeneratorPlan: $ns.fn.newNReturn($ns.fn.getNRun("random", ["int", 0, 6])),
			uiPlan: [$ns.ui.prgh([$ns.var.get(SEED_VAR_NAME), "! =", $ns.ui.input("answer")])],
			solutionPlan: $ns.fn.newNReturn(buildFactorialSolution($ns.var.get(SEED_VAR_NAME)))
		}
	},
	{
		handle: "powers",
		title: "Powers",
		aliases: ["powers", "power", "exponent", "exponents"],
		desc: "Practice powers and exponents.",
		beta: true,
		tags: ["math", "algebra"],
		data: {
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
		}
	}
];
