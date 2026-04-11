import assert from "node:assert/strict";
import test from "node:test";
import {
	ANSWER_VAR,
	correct,
	type ExerciseTemplateResource,
	generateSeed,
	generateSolution,
	SEED_VAR
} from "@/ns/resource-types/exercise-template";
import { $ns } from "@/ns/util/helpers";

const TEMP_SEED = { a: 2, b: 3 };
const TEMP_ANSWER = 5;

// Temporary sandbox for fast experimentation without touching the main suites.
test("temp sandbox: function-only plans", () => {
	const resource: ExerciseTemplateResource = {
		type: "exercise-template",
		title: "Temp",
		aliases: ["temp"],
		description: "temp",
		beta: true,
		id: "temp-sandbox",
		data: {
			exampleSeed: TEMP_SEED,
			exampleAnswer: TEMP_ANSWER,
			seedGeneratorPlan: $ns.fn.newNReturn($ns.obj.new(TEMP_SEED)),
			uiPlan: [],
			solutionPlan: $ns.fn.newNReturn(
				$ns.fn.getNRun("op", [
					"+",
					$ns.obj.getField($ns.var.get(SEED_VAR), "a"),
					$ns.obj.getField($ns.var.get(SEED_VAR), "b")
				])
			),
			correctionPlan: $ns.fn.newNReturn(
				$ns.fn.getNRun("compare", ["=", $ns.var.get(ANSWER_VAR), 5])
			)
		}
	};

	const seed = generateSeed(resource);
	assert.deepEqual(seed, TEMP_SEED);
	assert.equal(generateSolution(resource, seed), TEMP_ANSWER);
	assert.equal(correct(resource, seed, TEMP_ANSWER), true);
	assert.equal(correct(resource, seed, TEMP_ANSWER - 1), false);
});
