import type z from "zod";
import { executeNS } from "../execute";
import { createComplexNodeParser } from "../nodes.util";

export const NSVarSetNodeData = createComplexNodeParser({
	nstype: "var-set",
	props: ["id", "value"],
	execute: (node, ctx) => ctx.setVar(executeNS(node.id, ctx) as string, executeNS(node.value, ctx))
	// scan(node, ctx) {	},
});
export type NSVarSetNode = z.infer<typeof NSVarSetNodeData.schema>;
