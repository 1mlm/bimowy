import z from "zod";
import { executeNS } from "@/ns/execute";
import { scanNS } from "@/ns/scan";
import { simplifySchema } from "@/ns/simplify-schema";
import { createComplexNodeParser } from "../util";
import { assertIsBooleanSchema } from "./if.util";

export const NSIfNodeData = createComplexNodeParser({
	nstype: "if",
	props: ["if", "yes", "no"],
	execute: (node, ctx) =>
		executeNS(node.if, ctx) ? executeNS(node.yes, ctx) : executeNS(node.no, ctx),
	scan: (node, ctx) => {
		const [scannedIf, scannedYes, scannedNo] = [node.if, node.yes, node.no].map((n) =>
			scanNS(n, ctx)
		);
		assertIsBooleanSchema(scannedIf.schema);
		const NoAndYesSchema = simplifySchema(z.intersection(scannedYes.schema, scannedNo.schema));
		return {
			schema: NoAndYesSchema,
			notes: [...scannedIf.notes, ...scannedYes.notes, ...scannedNo.notes]
		};
	}
});
export type NSIfNode = z.infer<typeof NSIfNodeData.schema>;
