import z from "zod";
import { executeNS } from "../execute";
import { assertIsArray, assertIsString, createComplexNodeParser } from "./util";

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

// --

export const NSUIParagraphNodeData = createComplexNodeParser({
	nstype: "ui-paragraph",
	props: ["items"],
	execute(node, ctx) {
		assertIsArray(node.items);
		return executeNS(node.items, ctx);
	}
});
export type NSUIViewNode = z.infer<typeof NSUIParagraphNodeData.schema>;

// --

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

// --

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

// --

export const NSUINodeSchema = z.union(
	[NSUIInputNodeData, NSUITextNodeData, NSUIParagraphNodeData, NSUIWidgetNodeData].map(
		(s) => s.schema
	)
);
export type NSUINode = z.infer<typeof NSUINodeSchema>;
