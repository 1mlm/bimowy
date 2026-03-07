import type z from "zod";
import { executeNS } from "../execute";
import {
	assertBasicFunctionArgsParsed,
	assertIsArray,
	assertIsCustomFunction,
	isBasicFunction,
	isReturnNode
} from "./fn-run.util";
import { createComplexNodeParser } from "./util";

export const NSFunctionRunNodeData = createComplexNodeParser({
	nstype: "fn-run",
	props: ["fn", "args"],
	execute(node, ctx) {
		const fnValue = executeNS(node.fn, ctx);

		if (isBasicFunction(fnValue)) {
			const oldArgs = executeNS(node.args, ctx);
			const parsedArgs = fnValue.inputs.safeParse(oldArgs);
			assertBasicFunctionArgsParsed(parsedArgs, fnValue.id, oldArgs);
			return fnValue.execute(...parsedArgs.data);
		}

		assertIsCustomFunction(fnValue);
		const instructions = executeNS(fnValue.instructions, ctx);
		assertIsArray(instructions);
		for (const step of instructions) {
			const res = executeNS(step, ctx);
			if (isReturnNode(res)) return res.value;
		}
		return null; // No return statement found
	}
});

export type NSFunctionRunNode = z.infer<typeof NSFunctionRunNodeData.schema>;
