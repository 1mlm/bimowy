import type z from "zod";
import { getBasicFunctionById } from "@/ns/fn-registry";
import { executeNS } from "../../execute";
import { assertIsString, createComplexNodeParser } from "../util";

export const NSVarGetNodeData = createComplexNodeParser({
	nstype: "var-get",
	props: ["id"],
	execute: (node, ctx) => {
		const id = executeNS(node.id, ctx);
		assertIsString(id);
		const basicFn = getBasicFunctionById(id);
		return basicFn ?? ctx.getVar(id);
	}
});
export type NSVarGetNode = z.infer<typeof NSVarGetNodeData.schema>;
