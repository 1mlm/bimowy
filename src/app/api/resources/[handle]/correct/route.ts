import { NextResponse } from "next/server";
import z from "zod";
import { correct, getInputIds } from "@/ns/resource-types/exercise-template";
import { fetchResourceData } from "../../../util";

const BodySchema = z.object({
	seed: z.unknown(),
	inputs: z.record(z.string(), z.unknown())
});

export async function POST(req: Request, { params }: { params: Promise<{ handle: string }> }) {
	const { handle } = await params;
	const body = await req.json().catch(() => null);
	if (!body) return NextResponse.json({ message: "No request body." }, { status: 400 });

	const parsedBody = BodySchema.safeParse(body);
	if (!parsedBody.success)
		return NextResponse.json({ message: parsedBody.error.issues }, { status: 400 });

	const resource = await fetchResourceData(handle);
	if (!resource)
		return NextResponse.json({ message: `No resource found for "${handle}"` }, { status: 404 });

	const expectedInputIds = getInputIds(resource, parsedBody.data.seed);

	const actualInputIds = Object.keys(parsedBody.data.inputs).sort();
	const expectedSorted = [...expectedInputIds].sort();
	if (JSON.stringify(actualInputIds) !== JSON.stringify(expectedSorted)) {
		return NextResponse.json(
			{
				message: "Input IDs do not match exercise UI input IDs.",
				expected_input_ids: expectedSorted,
				actual_input_ids: actualInputIds
			},
			{ status: 400 }
		);
	}

	const result = correct(resource, parsedBody.data.seed, parsedBody.data.inputs);

	return NextResponse.json({ correct: result });
}
