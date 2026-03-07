import { basicFunctionRegistry } from "./basic-functions";
import { RuntimeContext } from "./context";
import { NSError } from "./error";
import { NSComplexNodesData, NSMinimumComplexNodeSchema, NSSimpleNodesData } from "./nodes";

function createDefaultRuntimeContext(): RuntimeContext {
	const ctx = new RuntimeContext();
	for (const fn of basicFunctionRegistry) {
		ctx.setVar(fn.id, fn);
	}
	return ctx;
}

export function executeNS(node: unknown, ctx = createDefaultRuntimeContext()): unknown {
	for (const simpleParser of NSSimpleNodesData) {
		const parsedNode = simpleParser.schema.safeParse(node);
		if (!parsedNode.success) continue;
		// @ts-expect-error
		return simpleParser.execute(parsedNode.data, ctx);
	}
	const minimumNode = NSMinimumComplexNodeSchema.safeParse(node);
	if (!minimumNode.success) throw new NSError("Unknown Node", node);

	const complexParser = NSComplexNodesData.find((c) => c.nstype === minimumNode.data._nstype);
	if (!complexParser) throw new NSError("Unknown Node Type", node);
	// @ts-expect-error
	return complexParser.execute(node, ctx);
}
