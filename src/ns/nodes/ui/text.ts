import type z from "zod";
import { executeNS } from "@/ns/execute";
import { createComplexNodeParser } from "../util";

export const NSUITextNodeData = createComplexNodeParser({
	nstype: "ui-text",
	props: ["text"],
	execute(node, ctx) {
		const text = executeNS(node.text, ctx);
		// TODO: Make sure it's a stirng or number
		return executeNS(text);
	}
});
export type NSUITextNode = z.infer<typeof NSUITextNodeData.schema>;
