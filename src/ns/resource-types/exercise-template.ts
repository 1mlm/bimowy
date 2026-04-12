import { isDeepStrictEqual } from "node:util";
import z from "zod";
import { NSRuntimeContext } from "../context/runtime";
import { executeNS } from "../execute";
import { NSNodeSchema } from "../nodes";
import { NSFunctionNodeData } from "../nodes/code/fn-create";
import { $ns } from "../util/helpers";
import { NSResource } from ".";

export const SEED_VAR_NAME = "_seed";
export const ANSWER_VAR_NAME = "_answer";

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

export function correct(resource: ExerciseTemplateResource, seed: unknown, answer: unknown) {
	const ctx = createSeededRuntimeContext(seed);
	ctx.setVar(ANSWER_VAR_NAME, answer);

	if (resource.data.correctionPlan) {
		const correctionResult = executeNS($ns.fn.run(resource.data.correctionPlan, []), ctx);
		if (typeof correctionResult === "boolean") return correctionResult;
		return isDeepStrictEqual(correctionResult, answer);
	}

	if (resource.data.solutionPlan)
		return isDeepStrictEqual(generateSolution(resource, seed), answer);

	throw new Error("Template has neither solutionPlan nor correctionPlan");
}
