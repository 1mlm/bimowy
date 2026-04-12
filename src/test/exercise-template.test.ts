import {
	ANSWER_VAR_NAME,
	correct,
	type ExerciseTemplateResource,
	generateSeed,
	generateSolution,
	SEED_VAR_NAME
} from "@/ns/resource-types/exercise-template";
import { $ns } from "@/ns/util/helpers";
import { $group, type TestItem } from "./index.test";

const OPERATION_SEED = ["-", 2, -8] as const;
const OPERATION_ANSWER = 10;

const operationsExerciseTest: ExerciseTemplateResource = {
	type: "exercise-template",
	title: "Operations (+/-)",
	aliases: ["operations", "plus-minus", "plus", "minus", "+", "-", "+/-"],
	description: "Handles positive and negative operands with dynamic seed.",
	beta: true,
	id: "operations-test",
	data: {
		exampleSeed: OPERATION_SEED,
		exampleAnswer: OPERATION_ANSWER,
		seedGeneratorPlan: $ns.fn.newNReturn([
			$ns.cond(
				$ns.fn.getNRun("compare", ["=", $ns.fn.getNRun("random", ["int", 0, 1]), 0]),
				"+",
				"-"
			),
			$ns.fn.getNRun("random", ["int", -10, 10]),
			$ns.fn.getNRun("random", ["int", -10, 10])
		]),
		uiPlan: [
			$ns.ui.prgh([
				"Compute",
				$ns.cond(
					$ns.fn.getNRun("compare", ["<", $ns.obj.getField($ns.var.get(SEED_VAR_NAME), 1), 0]),
					$ns.fn.getNRun("concat", ["(", $ns.obj.getField($ns.var.get(SEED_VAR_NAME), 1), ")"]),
					$ns.obj.getField($ns.var.get(SEED_VAR_NAME), 1)
				),
				$ns.obj.getField($ns.var.get(SEED_VAR_NAME), 0),
				$ns.cond(
					$ns.fn.getNRun("compare", ["<", $ns.obj.getField($ns.var.get(SEED_VAR_NAME), 2), 0]),
					$ns.fn.getNRun("concat", ["(", $ns.obj.getField($ns.var.get(SEED_VAR_NAME), 2), ")"]),
					$ns.obj.getField($ns.var.get(SEED_VAR_NAME), 2)
				),
				"=",
				$ns.ui.input("answer")
			])
		],
		solutionPlan: $ns.fn.newNReturn($ns.fn.getNRun("op", $ns.var.get(SEED_VAR_NAME))),
		correctionPlan: $ns.fn.newNReturn(
			$ns.fn.getNRun("compare", [
				"=",
				$ns.var.get(ANSWER_VAR_NAME),
				$ns.fn.getNRun("op", $ns.var.get(SEED_VAR_NAME))
			])
		)
	}
};

const templateExerciseCases = [
	{
		name: "operations template",
		items: [
			{
				name: "exampleSeed solution matches exampleAnswer",
				expected: OPERATION_ANSWER,
				actual: () =>
					generateSolution(operationsExerciseTest, operationsExerciseTest.data.exampleSeed)
			},
			{
				name: "exampleSeed correction accepts exampleAnswer",
				expected: true,
				actual: () =>
					correct(operationsExerciseTest, operationsExerciseTest.data.exampleSeed, OPERATION_ANSWER)
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
						OPERATION_ANSWER + 1
					)
			}
		]
	}
] satisfies TestItem[];

$group("template exercises", templateExerciseCases);
