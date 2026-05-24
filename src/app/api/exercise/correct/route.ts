import { NextResponse } from "next/server";
import z from "zod";
import { toExerciseTemplateResource } from "@/db/to-ns-resource";
import { fetchResource } from "@/db/util";
import { correct } from "@/ns/resource-types/exercise-template";
import { RESOURCE_TYPES_MAP } from "@/ui/constants/resource-types";

const BodySchema = z.object({
	type_handle: z.string(),
	handle: z.string(),
	seed: z.unknown(),
	inputs: z.record(z.string(), z.unknown())
});

export async function POST(req: Request) {
	const body = await req.json().catch(() => null);
	if (!body) return NextResponse.json({ message: "No request body." }, { status: 400 });

	const parsed = BodySchema.safeParse(body);
	if (!parsed.success) return NextResponse.json({ message: parsed.error.issues }, { status: 400 });

	const resourceTypeInfo = RESOURCE_TYPES_MAP.find((t) => t.handle === parsed.data.type_handle);
	if (!resourceTypeInfo)
		return NextResponse.json({ message: "Unknown resource type." }, { status: 400 });

	const dbResource = await fetchResource(resourceTypeInfo.type, parsed.data.handle);
	if (!dbResource)
		return NextResponse.json({ message: "Resource not found." }, { status: 404 });

	const resource = toExerciseTemplateResource(dbResource);
	const result = correct(resource, parsed.data.seed, parsed.data.inputs);

	return NextResponse.json({ result });
}
