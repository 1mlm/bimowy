import { type BasicFunction, basicFunctionRegistry } from "../basic-functions";
import type { RuntimeContext } from "../context";
import { NSError } from "../error";
import { type NSFunctionNode, NSFunctionNodeData } from "./fn-create";
import { type NSReturnNode, NSReturnNodeData } from "./return";

export function assertIsArray(wtv: unknown): asserts wtv is unknown[] {
	if (!Array.isArray(wtv)) throw new NSError("Value is not an array", wtv);
}

export function assertIsBasicFunction(
	fn: BasicFunction | undefined,
	id: string
): asserts fn is BasicFunction {
	if (!fn) throw new NSError(`Basic function '${id}' not found`, { id });
}

export function assertIsCustomFunction(fn: unknown): asserts fn is NSFunctionNode {
	const result = NSFunctionNodeData.schema.safeParse(fn);
	if (!result.success) throw new NSError("Value is not a custom function", fn);
}

export function getBasicFunction(id: string): BasicFunction | undefined {
	return basicFunctionRegistry.find((fn) => fn.id === id);
}

export function getCustomFunction(id: string, ctx: RuntimeContext): unknown {
	return ctx.getVar(id);
}

export function isReturnNode(node: unknown): node is NSReturnNode {
	return NSReturnNodeData.schema.safeParse(node).success;
}
