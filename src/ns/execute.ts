import { NSRuntimeContext } from "./context/runtime";
import { NSError } from "./error";
import { NSComplexCodeNodesData, NSMinimumComplexNodeSchema, NSSimpleCodeNodesData } from "./nodes";

export function executeNS(node: unknown, ctx = new NSRuntimeContext()): unknown {
	for (const simpleParser of NSSimpleCodeNodesData) {
		const parsedNode = simpleParser.schema.safeParse(node);
		if (!parsedNode.success) continue;
		// @ts-expect-error
		return simpleParser.execute(parsedNode.data, ctx);
	}
	const minimumNode = NSMinimumComplexNodeSchema.safeParse(node);
	if (!minimumNode.success) throw new NSError("Unknown Node", node);

	const complexParser = NSComplexCodeNodesData.find((c) => c.nstype === minimumNode.data._nstype);
	if (!complexParser) throw new NSError("Unknown Node Type", node);
	// @ts-expect-error
	return complexParser.execute(node, ctx);
}
