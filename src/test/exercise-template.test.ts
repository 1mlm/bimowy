import {
	correct,
	type ExerciseTemplateResource,
	generateSeed,
	generateSolution
} from "@/ns/resource-types/exercise-template";
import { $ns } from "@/ns/util/helpers";
import { $group, type TestItem } from "./index.test";

const operationsExerciseTest: ExerciseTemplateResource = {
	type: "exercise-template",
	title: "Operations (+/-)",
	aliases: ["operations", "plus-minus", "plus", "minus", "+", "-", "+/-"],
	description: "Handles positive and negative operands with dynamic seed.",
	beta: true,
	id: "operations-test",
	data: {
		exampleSeed: ["+", 2, -8],
		exampleAnswer: -6,
		seedGeneratorPlan: [
			$ns.cond(
				$ns.fn.getNRun("compare", ["=", $ns.fn.getNRun("random", ["int", 0, 1]), 0]),
				"+",
				"-"
			),
			$ns.fn.getNRun("random", ["int", -10, 10]),
			$ns.fn.getNRun("random", ["int", -10, 10])
		],
		uiPlan: [
			$ns.ui.prgh([
				"Compute",
				$ns.cond(
					$ns.fn.getNRun("compare", ["<", $ns.obj.getField($ns.var.get("_seed"), 1), 0]),
					$ns.fn.getNRun("concat", ["(", $ns.obj.getField($ns.var.get("_seed"), 1), ")"]),
					$ns.obj.getField($ns.var.get("_seed"), 1)
				),
				$ns.obj.getField($ns.var.get("_seed"), 0),
				$ns.cond(
					$ns.fn.getNRun("compare", ["<", $ns.obj.getField($ns.var.get("_seed"), 2), 0]),
					$ns.fn.getNRun("concat", ["(", $ns.obj.getField($ns.var.get("_seed"), 2), ")"]),
					$ns.obj.getField($ns.var.get("_seed"), 2)
				),
				"=",
				$ns.ui.input("answer")
			])
		],
		solutionPlan: $ns.fn.getNRun("op", [
			$ns.obj.getField($ns.var.get("_seed"), 0),
			$ns.obj.getField($ns.var.get("_seed"), 1),
			$ns.obj.getField($ns.var.get("_seed"), 2)
		]),
		correctionPlan: $ns.fn.getNRun("compare", [
			"=",
			$ns.var.get("_answer"),
			$ns.fn.getNRun("op", [
				$ns.obj.getField($ns.var.get("_seed"), 0),
				$ns.obj.getField($ns.var.get("_seed"), 1),
				$ns.obj.getField($ns.var.get("_seed"), 2)
			])
		])
	}
};

const templateExerciseCases = [
	{
		name: "operations template",
		items: [
			{
				name: "exampleSeed solution matches exampleAnswer",
				expected: operationsExerciseTest.data.exampleAnswer,
				actual: () =>
					generateSolution(operationsExerciseTest, operationsExerciseTest.data.exampleSeed)
			},
			{
				name: "exampleSeed correction accepts exampleAnswer",
				expected: true,
				actual: () =>
					correct(
						operationsExerciseTest,
						operationsExerciseTest.data.exampleSeed,
						operationsExerciseTest.data.exampleAnswer
					)
			}
		]
	},
	{
		name: "dynamic seed shape",
		items: [
			{
				name: "seed uses operation tuple",
				expected: true,
				actual: () => {
					const seed = generateSeed(operationsExerciseTest);
					if (!Array.isArray(seed) || seed.length !== 3) return false;
					const [op, left, right] = seed;
					return (
						(op === "+" || op === "-") && typeof left === "number" && typeof right === "number"
					);
				}
			},
			{
				name: "correction rejects wrong answer",
				expected: false,
				actual: () =>
					correct(
						operationsExerciseTest,
						operationsExerciseTest.data.exampleSeed,
						operationsExerciseTest.data.exampleAnswer + 1
					)
			}
		]
	}
] satisfies TestItem[];

$group("template exercises", templateExerciseCases);
