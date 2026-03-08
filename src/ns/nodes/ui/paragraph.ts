import type z from "zod";
import { executeNS } from "@/ns/execute";
import { assertIsArray, createComplexNodeParser } from "../util";

export const NSUIParagraphNodeData = createComplexNodeParser({
	nstype: "ui-prgh",
	props: ["items"],
	execute(node, ctx) {
		assertIsArray(node.items);
		return executeNS(node.items, ctx);
	}
});
export type NSUIViewNode = z.infer<typeof NSUIParagraphNodeData.schema>;
