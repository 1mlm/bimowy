import type z from "zod";
import { executeNS } from "../execute";
import { assertIsString, createComplexNodeParser } from "./util";

export const NSVarGetNodeData = createComplexNodeParser({
	nstype: "var-get",
	props: ["id"],
	execute: (node, ctx) => {
		const id = executeNS(node.id, ctx);
		assertIsString(id);
		return ctx.getVar(id);
	}
});
export type NSVarGetNode = z.infer<typeof NSVarGetNodeData.schema>;
