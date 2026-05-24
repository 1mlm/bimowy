import type z from "zod";
import { executeNS } from "@/ns/execute";
import { assertIsString, createComplexNodeParser } from "../util";

export const NSUIInputChoiceNodeData = createComplexNodeParser({
	nstype: "ui-input-choice",
	props: ["id", "options"],
	execute(node, ctx) {
		const id = executeNS(node.id, ctx);
		assertIsString(id);
		const options = executeNS(node.options, ctx);
		return { ...node, id, options };
	}
});
export type NSUIInputChoiceNode = z.infer<typeof NSUIInputChoiceNodeData.schema>;
