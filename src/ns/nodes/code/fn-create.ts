import type z from "zod";
import { createComplexNodeParser } from "@/ns/nodes/util";

export const NSFunctionNodeData = createComplexNodeParser({
	nstype: "fn-create",
	props: ["inputs", "instructions"],
	execute(node) {
		return node;
	}
});

export type NSFunctionNode = z.infer<typeof NSFunctionNodeData.schema>;
