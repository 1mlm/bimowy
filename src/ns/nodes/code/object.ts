import z from "zod";
import { executeNS } from "@/ns/execute";
import { scanNS } from "@/ns/scan";
import { createComplexNodeParser } from "../util";

export const NSObjectNodeData = createComplexNodeParser({
	nstype: "object",
	props: ["props"],
	execute: (node, ctx) => {
		if (typeof node.props !== "object" || node.props === null || Array.isArray(node.props)) {
			throw new Error("object node props must be an object");
		}
		return Object.fromEntries(
			Object.entries(node.props).map(([key, value]) => [key, executeNS(value, ctx)])
		);
	},
	scan: (node, ctx) => {
		if (typeof node.props !== "object" || node.props === null || Array.isArray(node.props)) {
			throw new Error("object node props must be an object");
		}
		const entries = Object.entries(node.props).map(([key, value]) => {
			const scan = scanNS(value, ctx);
			return [key, scan] as const;
		});
		return {
			notes: entries.flatMap(([, scan]) => scan.notes),
			schema: z.object(Object.fromEntries(entries.map(([key, scan]) => [key, scan.schema])))
		};
	}
});

export type NSObjectNode = z.infer<typeof NSObjectNodeData.schema>;
