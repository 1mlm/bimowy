import z from "zod";
import { NSArrayNodeData } from "./nodes/code/array";
import { NSFunctionNodeData } from "./nodes/code/fn-create";
import { NSFunctionRunNodeData } from "./nodes/code/fn-run";
import { NSGetFieldNodeData } from "./nodes/code/get-field";
import { NSIfNodeData } from "./nodes/code/if";
import { NSObjectNodeData } from "./nodes/code/object";
import { NSPrimitiveNodeData } from "./nodes/code/primitive";
import { NSReturnNodeData } from "./nodes/code/return";
import { NSVarGetNodeData } from "./nodes/code/var-get";
import { NSVarSetNodeData } from "./nodes/code/var-set";
import { NSUIInputNodeData } from "./nodes/ui/input";
import { NSUIInputChoiceNodeData } from "./nodes/ui/input-choice";
import { NSUIParagraphNodeData } from "./nodes/ui/paragraph";
import { NSUITextNodeData } from "./nodes/ui/text";
import { NSUIWidgetNodeData } from "./nodes/ui/widget";

// --

export const NSComplexNodeIDSchema = z.enum([
	"if",
	"var-get",
	"var-set",
	"return",
	"fn-run",
	"fn-create",
	// --
	"object",
	"get-field",
	// --
	"ui-widget",
	"ui-prgh",
	"ui-input",
	"ui-input-choice",
	"ui-text"
]);
export type NSNodeID = z.infer<typeof NSComplexNodeIDSchema>;

// --

export const NSMinimumComplexNodeSchema = z.object({ _nstype: NSComplexNodeIDSchema });
export const NSMinimumNodeSchema = z.union([
	NSPrimitiveNodeData.schema,
	NSMinimumComplexNodeSchema
]);

export const NSSimpleCodeNodesData = [NSPrimitiveNodeData, NSArrayNodeData];
export const NSComplexCodeNodesData = [
	NSIfNodeData,
	NSVarGetNodeData,
	NSGetFieldNodeData,
	NSVarSetNodeData,
	NSReturnNodeData,
	NSFunctionNodeData,
	NSFunctionRunNodeData,
	NSObjectNodeData,
	NSUIInputNodeData,
	NSUIInputChoiceNodeData,
	NSUITextNodeData,
	NSUIParagraphNodeData,
	NSUIWidgetNodeData
];

export const NSNodeData = [...NSSimpleCodeNodesData, ...NSComplexCodeNodesData];

export const NSSimpleNodeSchema = z.union(NSSimpleCodeNodesData.map((n) => n.schema));
export type NSSimpleNode = z.infer<typeof NSSimpleNodeSchema>;
export const NSComplexNodeSchema = z.union(NSComplexCodeNodesData.map((n) => n.schema));
export type NSComplexNode = z.infer<typeof NSComplexNodeSchema>;

export const NSNodeSchema = z.union([NSSimpleNodeSchema, NSComplexNodeSchema]);
export type NSNode = z.infer<typeof NSNodeSchema>;
