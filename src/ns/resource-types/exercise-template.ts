import z from "zod";
import { NSResource } from ".";
import { NSRuntimeContext } from "../context/runtime";
import { executeNS } from "../execute";
import { NSNodeSchema } from "../nodes";
import { NSFunctionNodeData } from "../nodes/code/fn-create";
import { $ns } from "../util/helpers";

function deepEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true;
	if (typeof a !== typeof b || a === null || b === null) return false;
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		return a.every((v, i) => deepEqual(v, b[i]));
	}
	if (typeof a === "object" && typeof b === "object") {
		const ka = Object.keys(a as object);
		const kb = Object.keys(b as object);
		if (ka.length !== kb.length) return false;
		return ka.every((k) =>
			deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])
		);
	}
	return false;
}

export const SEED_VAR_NAME = "_seed";
export const ANSWER_VAR_NAME = "_answer";
export const INPUTS_VAR_NAME = "_inputs";

export type CorrectionNote = {
	type: "note" | "warning";
	message: string;
};

export type InputCorrection = {
	is_correct: boolean;
	value?: unknown;
	note?: CorrectionNote;
};

export type CorrectionResult = Record<string, InputCorrection>;

const ExerciseTemplateResourceDataBaseSchema = z.object({
	exampleSeed: z.unknown(),
	exampleAnswer: z.number(),
	seedGeneratorPlan: NSFunctionNodeData.schema,
	uiPlan: z.array(NSNodeSchema)
});

const ExerciseTemplateResourceDataSchema = z.union([
	ExerciseTemplateResourceDataBaseSchema.extend({
		solutionPlan: NSFunctionNodeData.schema,
		correctionPlan: NSFunctionNodeData.schema.optional()
	}),
	ExerciseTemplateResourceDataBaseSchema.extend({
		solutionPlan: NSFunctionNodeData.schema.optional(),
		correctionPlan: NSFunctionNodeData.schema
	})
]);

export const ExerciseTemplateResource = NSResource.extend({
	type: z.literal("exercise-template"),
	data: ExerciseTemplateResourceDataSchema
});

export type ExerciseTemplateResource = z.infer<typeof ExerciseTemplateResource>;

function createSeededRuntimeContext(seed: unknown) {
	const ctx = new NSRuntimeContext();
	ctx.setVar(SEED_VAR_NAME, seed);
	return ctx;
}

export function generateSeed(resource: ExerciseTemplateResource) {
	return executeNS($ns.fn.run(resource.data.seedGeneratorPlan, []));
}

export function generateUI(resource: ExerciseTemplateResource, seed: unknown) {
	const ctx = createSeededRuntimeContext(seed);
	return resource.data.uiPlan.map((node) => executeNS(node, ctx));
}

export function generateSolution(resource: ExerciseTemplateResource, seed: unknown) {
	if (!resource.data.solutionPlan)
		throw new Error("Cannot generate solution from a correction-plan template");
	const seedCtx = createSeededRuntimeContext(seed);
	return executeNS($ns.fn.run(resource.data.solutionPlan, []), seedCtx);
}

function collectInputIds(node: unknown): string[] {
	if (Array.isArray(node)) return node.flatMap(collectInputIds);
	if (typeof node !== "object" || node === null) return [];
	const candidate = node as Record<string, unknown>;
	const direct =
		candidate._nstype === "ui-input" && typeof candidate.id === "string" ? [candidate.id] : [];
	return [...direct, ...Object.values(candidate).flatMap((value) => collectInputIds(value))];
}

export function getInputIds(resource: ExerciseTemplateResource, seed: unknown): string[] {
	const ui = generateUI(resource, seed);
	return Array.from(new Set(collectInputIds(ui)));
}

function toCorrectionResult(
	inputIds: string[],
	inputs: Record<string, unknown>,
	result: unknown
): CorrectionResult {
	if (typeof result === "boolean") {
		return Object.fromEntries(
			inputIds.map((id) => [id, { is_correct: result }])
		) as CorrectionResult;
	}

	if (typeof result === "object" && result !== null && !Array.isArray(result)) {
		const obj = result as Record<string, unknown>;
		return Object.fromEntries(
			inputIds.map((id) => {
				const value = obj[id];
				if (typeof value === "boolean") return [id, { is_correct: value }] as const;
				if (typeof value === "object" && value !== null && "is_correct" in value) {
					const candidate = value as { is_correct: unknown; value?: unknown; note?: unknown };
					const note =
						typeof candidate.note === "object" &&
						candidate.note !== null &&
						("type" in candidate.note || "message" in candidate.note)
							? (candidate.note as CorrectionNote)
							: undefined;
					return [
						id,
						{
							is_correct: Boolean(candidate.is_correct),
							value: candidate.value,
							note
						}
					] as const;
				}
				return [
					id,
					{
						is_correct: deepEqual(value, inputs[id]),
						value,
						note: {
							type: "warning",
							message: `Correction plan did not return a boolean status for "${id}", falling back to deep comparison.`
						}
					}
				] as const;
			})
		) as CorrectionResult;
	}

	return Object.fromEntries(
		inputIds.map((id) => [
			id,
			{
				is_correct: false,
				note: {
					type: "warning",
					message: "Correction plan returned an unsupported value."
				}
			}
		])
	) as CorrectionResult;
}

function fallbackSolutionCorrection(
	resource: ExerciseTemplateResource,
	seed: unknown,
	inputs: Record<string, unknown>,
	inputIds: string[]
): CorrectionResult {
	const solution = generateSolution(resource, seed);
	if (typeof solution === "object" && solution !== null && !Array.isArray(solution)) {
		const sol = solution as Record<string, unknown>;
		return Object.fromEntries(
			inputIds.map((id) => [
				id,
				{
					is_correct: deepEqual(sol[id], inputs[id]),
					value: sol[id]
				}
			])
		) as CorrectionResult;
	}

	if (inputIds.length === 1) {
		const onlyId = inputIds[0];
		return {
			[onlyId]: {
				is_correct: deepEqual(solution, inputs[onlyId]),
				value: solution
			}
		};
	}

	if ("answer" in inputs) {
		return Object.fromEntries(
			inputIds.map((id) => [
				id,
				{
					is_correct: id === "answer" ? deepEqual(solution, inputs.answer) : false,
					value: id === "answer" ? solution : undefined,
					note:
						id === "answer"
							? undefined
							: {
									type: "warning",
									message:
										"No correctionPlan provided, and solutionPlan is scalar while UI expects multiple inputs."
								}
				}
			])
		) as CorrectionResult;
	}

	return Object.fromEntries(
		inputIds.map((id) => [
			id,
			{
				is_correct: false,
				note: {
					type: "warning",
					message: "No correctionPlan provided, and scalar solution cannot be mapped to this input."
				}
			}
		])
	) as CorrectionResult;
}

export function correct(
	resource: ExerciseTemplateResource,
	seed: unknown,
	inputs: Record<string, unknown>
): CorrectionResult {
	const inputIds = getInputIds(resource, seed);
	const ctx = createSeededRuntimeContext(seed);
	ctx.setVar(INPUTS_VAR_NAME, inputs);
	ctx.setVar(ANSWER_VAR_NAME, inputs.answer);

	if (resource.data.correctionPlan) {
		const correctionResult = executeNS($ns.fn.run(resource.data.correctionPlan, []), ctx);
		return toCorrectionResult(inputIds, inputs, correctionResult);
	}

	if (resource.data.solutionPlan)
		return fallbackSolutionCorrection(resource, seed, inputs, inputIds);

	throw new Error("Template has neither solutionPlan nor correctionPlan");
}
