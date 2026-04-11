import { isDeepStrictEqual } from "util";
import z from "zod";
import { NSRuntimeContext } from "../context/runtime";
import { executeNS } from "../execute";
import { NSNodeSchema } from "../nodes";
import { NSResource } from ".";

const ExerciseTemplateResourceDataSchema = z
	.object({
		exampleSeed: z.unknown(),
		exampleAnswer: z.number(),
		seedGeneratorPlan: NSNodeSchema,
		uiPlan: z.array(NSNodeSchema),
		solutionPlan: NSNodeSchema.optional(),
		correctionPlan: NSNodeSchema.optional()
	})
	.refine(
		(data) =>
			typeof data.solutionPlan !== "undefined" || typeof data.correctionPlan !== "undefined",
		{
			message: "Exercise template needs at least one of solutionPlan or correctionPlan"
		}
	);

export const ExerciseTemplateResource = NSResource.extend({
	type: z.literal("exercise-template"),
	data: ExerciseTemplateResourceDataSchema
});

export type ExerciseTemplateResource = z.infer<typeof ExerciseTemplateResource>;

function createSeededRuntimeContext(seed: unknown) {
	const ctx = new NSRuntimeContext();
	ctx.setVar("_seed", seed);
	return ctx;
}

export function generateSeed(resource: ExerciseTemplateResource) {
	return executeNS(resource.data.seedGeneratorPlan);
}

export function generateUI(resource: ExerciseTemplateResource, seed: unknown) {
	const ctx = createSeededRuntimeContext(seed);
	return resource.data.uiPlan.map((node) => executeNS(node, ctx));
}

export function generateSolution(resource: ExerciseTemplateResource, seed: unknown) {
	if (typeof resource.data.solutionPlan === "undefined") {
		throw new Error("Cannot generate solution from a correction-plan template");
	}
	const seedCtx = createSeededRuntimeContext(seed);
	return executeNS(resource.data.solutionPlan, seedCtx);
}

export function correct(resource: ExerciseTemplateResource, seed: unknown, answer: unknown) {
	const ctx = createSeededRuntimeContext(seed);
	ctx.setVar("_answer", answer);
	ctx.setVar("_input", answer);

	if (typeof resource.data.correctionPlan !== "undefined") {
		const correctionResult = executeNS(resource.data.correctionPlan, ctx);
		if (typeof correctionResult === "boolean") return correctionResult;
		return isDeepStrictEqual(correctionResult, answer);
	}

	if (typeof resource.data.solutionPlan !== "undefined") {
		return isDeepStrictEqual(generateSolution(resource, seed), answer);
	}

	throw new Error("Template has neither solutionPlan nor correctionPlan");
}
