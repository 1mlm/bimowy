import z from "zod";
import { executeNS } from "@/ns/execute";
import { createSimpleNodeParser } from "@/ns/nodes/util";
import { scanNS } from "@/ns/scan";

export const NSArrayNodeData = createSimpleNodeParser({
	schema: z.array(z.unknown()),
	execute: (nodes, ctx) => nodes.map((node) => executeNS(node, ctx)),
	scan: (node, ctx) => {
		const scans = node.map((n) => scanNS(n, ctx));
		const schemas = scans.map((s) => s.schema);
		const notes = scans.map((s) => s.notes);
		const totalSchema =
			schemas.length > 0 ? z.tuple(schemas as [z.ZodType, ...z.ZodType[]]) : z.array(z.never());
		return { notes: notes.flat(), schema: totalSchema };
	}
});
export type NSArrayNode = z.infer<typeof NSArrayNodeData.schema>;
