import z from "zod";
import { simplifySchema } from "@/ns/context/simplify-schema";
import { executeNS } from "@/ns/execute";
import { scanNS } from "@/ns/scan";
import { assertIsBoolean, assertIsBooleanSchema, createComplexNodeParser } from "../util";

export const NSIfNodeData = createComplexNodeParser({
	nstype: "if",
	props: ["condition", "yes", "no"],
	execute: (node, ctx) => {
		const condition = executeNS(node.condition, ctx);
		assertIsBoolean(condition);
		return condition ? executeNS(node.yes, ctx) : executeNS(node.no, ctx);
	},
	scan: (node, ctx) => {
		const [scannedIf, scannedYes, scannedNo] = [node.condition, node.yes, node.no].map((n) =>
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
