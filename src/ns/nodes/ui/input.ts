import type z from "zod";
import { executeNS } from "@/ns/execute";
import { assertIsString, createComplexNodeParser } from "../util";

export const NSUIInputNodeData = createComplexNodeParser({
	nstype: "ui-input",
	props: ["id"],
	execute(node, ctx) {
		const id = executeNS(node.id, ctx);
		assertIsString(id);
		return { ...node, id };
	}
});
export type NSUIInputNode = z.infer<typeof NSUIInputNodeData.schema>;
