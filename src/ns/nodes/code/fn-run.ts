import type z from "zod";
import { RuntimeContext } from "@/ns/context";
import { NSError } from "@/ns/error";
import { executeNS } from "@/ns/execute";
import { assertIsArray, createComplexNodeParser } from "@/ns/nodes/util";
import {
	assertBasicFunctionArgsParsed,
	assertIsCustomFunction,
	isBasicFunction,
	isReturnNode
} from "./fn-run.util";

export const NSFunctionRunNodeData = createComplexNodeParser({
	nstype: "fn-run",
	props: ["fn", "args"],
	execute(node, ctx) {
		const fn = executeNS(node.fn, ctx);

		if (isBasicFunction(fn)) {
			const oldArgs = executeNS(node.args, ctx);
			const parsedArgs = fn.inputs.safeParse(oldArgs);
			assertBasicFunctionArgsParsed(parsedArgs, fn.id, oldArgs);
			return fn.execute(...parsedArgs.data);
		}

		assertIsCustomFunction(fn);
		const inputNames = executeNS(fn.inputs, ctx);
		assertIsArray(inputNames);

		const argValues = executeNS(node.args, ctx);
		assertIsArray(argValues);
		if (inputNames.length !== argValues.length) {
			throw new NSError("Custom function argument count mismatch", {
				inputs: inputNames,
				args: argValues
			});
		}

		const ctx2 = new RuntimeContext(ctx);
		for (const [i, inputName] of inputNames.entries()) {
			if (typeof inputName !== "string") {
				throw new NSError("Custom function input names must be strings", {
					inputName,
					index: i
				});
			}
			ctx2.setVar(inputName, argValues[i]);
		}

		const instructions = executeNS(fn.instructions, ctx2);
		assertIsArray(instructions);
		for (const step of instructions) {
			const res = executeNS(step, ctx2);
			if (isReturnNode(res)) return res.value;
		}

		return null;
	}
});

export type NSFunctionRunNode = z.infer<typeof NSFunctionRunNodeData.schema>;
