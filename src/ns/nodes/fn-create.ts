import type z from "zod";
import { createComplexNodeParser } from "../util";

export const NSFunctionNodeData = createComplexNodeParser({
	nstype: "fn-create",
	props: ["inputs", "instructions"],
	execute(_node, _ctx) {
		return _node;
	}
});
export type NSFunctionNode = z.infer<typeof NSFunctionNodeData.schema>;
