import z from "zod";
import { createSimpleNodeParser } from "../nodes.util";
import type { NSDiagnostic } from "../scan";

// --

export const NSPrimitiveNodeData = createSimpleNodeParser({
	schema: z.union([z.string(), z.number(), z.boolean(), z.null()]),
	execute: (node) => node,
	scan(node) {
		const notes: NSDiagnostic[] = [];
		if (node === null) return { schema: z.null(), notes };
		return {
			notes,
			schema: z.literal(node)
		};
	}
});
export type NSPrimitiveNode = z.infer<typeof NSPrimitiveNodeData.schema>;
