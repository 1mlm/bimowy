import type { BasicFunction } from "../basic-functions";
import { NSError } from "../error";
import { type NSFunctionNode, NSFunctionNodeData } from "./fn-create";
import { type NSReturnNode, NSReturnNodeData } from "./return";

export function isBasicFunction(value: unknown): value is BasicFunction {
	if (typeof value !== "object" || value === null) return false;
	const candidate = value as Record<string, unknown>;
	return (
		typeof candidate.id === "string" &&
		typeof candidate.execute === "function" &&
		typeof candidate.inputs === "object" &&
		candidate.inputs !== null &&
		typeof candidate.output === "object" &&
		candidate.output !== null
	);
}

export function assertIsCustomFunction(fn: unknown): asserts fn is NSFunctionNode {
	const result = NSFunctionNodeData.schema.safeParse(fn);
	if (!result.success) throw new NSError("Value is not a custom function", fn);
}

export function assertBasicFunctionArgsParsed(
	parsedArgs: ReturnType<BasicFunction["inputs"]["safeParse"]>,
	fnId: string,
	oldArgs: unknown
): asserts parsedArgs is Extract<typeof parsedArgs, { success: true }> {
	if (!parsedArgs.success) {
		throw new NSError(`Invalid arguments for function ${fnId}`, {
			args: oldArgs,
			errors: parsedArgs.error
		});
	}
}

export function isReturnNode(node: unknown): node is NSReturnNode {
	return NSReturnNodeData.schema.safeParse(node).success;
}
