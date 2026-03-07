import type z from "zod";
import { executeNS } from "@/ns/execute";
import { createComplexNodeParser } from "@/ns/nodes/util";

export const NSReturnNodeData = createComplexNodeParser({
	nstype: "return",
	props: ["value"],
	execute: (node, ctx) => ({ ...node, value: executeNS(node.value, ctx) })
});
export type NSReturnNode = z.infer<typeof NSReturnNodeData.schema>;
