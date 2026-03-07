import type z from "zod";
import { executeNS } from "@/ns/execute";
import { assertIsString, createComplexNodeParser } from "../util";

export const NSUIWidgetNodeData = createComplexNodeParser({
	nstype: "ui-widget",
	props: ["id", "args"],
	execute(node, ctx) {
		const id = executeNS(node.id, ctx);
		assertIsString(id);
		// TODO: Should make sure this is a valid widget ID
		const args = executeNS(node.args, ctx);
		// TODO: hould assert that those are the correct args for the specific widget id
		return { id, args: args };
	}
});
export type NSUIWidgetNode = z.infer<typeof NSUIWidgetNodeData>;
