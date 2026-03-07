import type z from "zod";
import { type BasicFunction, basicFunctionRegistry } from "../basic-functions";
import type { RuntimeContext } from "../context";
import { NSError } from "../error";
import { executeNS } from "../execute";
import { createComplexNodeParser } from "../util";
import { type NSFunctionNode, NSFunctionNodeData } from "./fn-create";
import { type NSReturnNode, NSReturnNodeData } from "./return";

export const NSFunctionRunNodeData = createComplexNodeParser({
	nstype: "fn-run",
	props: ["id", "args"],
	execute(node, ctx) {
		const id = executeNS(node.id, ctx);
		assertIsString(id);

		const customFn = getCustomFunction(id, ctx);
		if (customFn) {
			assertIsCustomFunction(customFn);
			const instructions = executeNS(customFn.instructions, ctx);
			assertIsArray(instructions);
			for (const step of instructions) {
				const res = executeNS(step, ctx);
				if (isReturnNode(res)) return res.value;
			}
			return null; // No return statement found
		}

		const fn = getBasicFunction(id);
		assertIsBasicFunction(fn, id);

		const oldArgs = executeNS(node.args, ctx);
		const parsedArgs = fn.inputs.safeParse(oldArgs);
		if (!parsedArgs.success) {
			throw new NSError(`Invalid arguments for function ${id}`, {
				args: oldArgs,
				errors: parsedArgs.error
			});
		}
		return fn.execute(...parsedArgs.data);
	}
});
export type NSFunctionRunNode = z.infer<typeof NSFunctionRunNodeData.schema>;

export function assertIsString(wtv: unknown): asserts wtv is string {
	if (typeof wtv !== "string") throw new NSError("Value is not a string", wtv);
}

function isReturnNode(node: unknown): node is NSReturnNode {
	return NSReturnNodeData.schema.safeParse(node).success;
}

function assertIsArray(wtv: unknown): asserts wtv is unknown[] {
	if (!Array.isArray(wtv)) throw new NSError("Value is not an array", wtv);
}

function assertIsBasicFunction(
	fn: BasicFunction | undefined,
	id: string
): asserts fn is BasicFunction {
	if (!fn) throw new NSError(`Basic function '${id}' not found`, { id });
}

function assertIsCustomFunction(fn: unknown): asserts fn is NSFunctionNode {
	const result = NSFunctionNodeData.schema.safeParse(fn);
	if (!result.success) throw new NSError("Value is not a custom function", fn);
}

function getBasicFunction(id: string): BasicFunction | undefined {
	return basicFunctionRegistry.find((fn) => fn.id === id);
}

function getCustomFunction(id: string, ctx: RuntimeContext): unknown {
	return ctx.getVar(id);
}
