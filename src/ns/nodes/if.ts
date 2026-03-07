import z from "zod";
import { NSError } from "../error";
import { executeNS } from "../execute";
import { isSchemaSubset } from "../is-schema-subset";
import { createComplexNodeParser } from "../nodes.util";
import { scanNS } from "../scan";
import { simplifySchema } from "../simplify-schema";

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

function assertIsBooleanSchema(schema: z.ZodType): asserts schema is z.ZodBoolean {
	if (!isSchemaSubset(z.boolean(), schema)) throw new NSError("Schema is not a boolean", schema);
}
