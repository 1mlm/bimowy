import type z from "zod";
import { ScantimeContext } from "./context";
import { NSError } from "./error";
import { NSNodeData } from "./nodes";

export type NSScan = {
	schema: z.ZodType;
	notes: NSDiagnostic[];
};

export type NSDiagnostic = {
	level: "warning" | "info";
	code: string;
	message: string;
	extra?: unknown;
};

export function scanNS(node: unknown, ctx = new ScantimeContext()): NSScan {
	for (const nodeData of NSNodeData) {
		const parsedNode = nodeData.schema.safeParse(node);
		if (!parsedNode.success) continue;

		const { data } = parsedNode;
		// @ts-expect-error
		return nodeData.scan(data, ctx);
	}

	throw new NSError("Could not parse node", node);
}
