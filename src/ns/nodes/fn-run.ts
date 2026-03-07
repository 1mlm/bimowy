import type z from "zod";
import { NSError } from "../error";
import { executeNS } from "../execute";
import { createComplexNodeParser } from "../nodes.util";
import {
	assertIsArray,
	assertIsBasicFunction,
	assertIsCustomFunction,
	getBasicFunction,
	getCustomFunction,
	isReturnNode
} from "./fn-run.util";
import { assertIsString } from "./util";

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
