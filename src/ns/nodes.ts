import z from "zod";
import { NSArrayNodeData } from "./nodes/array";
import { NSFunctionNodeData } from "./nodes/fn-create";
import { NSFunctionRunNodeData } from "./nodes/fn-run";
import { NSIfNodeData } from "./nodes/if";
import { NSPrimitiveNodeData } from "./nodes/primitive";
import { NSReturnNodeData } from "./nodes/return";
import { NSVarGetNodeData } from "./nodes/var-get";
import { NSVarSetNodeData } from "./nodes/var-set";

// --

export const NSComplexNodeIDSchema = z.enum([
	"if",
	"var-get",
	"var-set",
	"return",
	"fn-run",
	"fn-create",
	// --
	"ui-widget",
	"ui-paragraph",
	"ui-input",
	"ui-text"
]);
export type NSNodeID = z.infer<typeof NSComplexNodeIDSchema>;

// --
export const NSMinimumComplexNodeSchema = z.object({ _nstype: NSComplexNodeIDSchema });
export const NSSimpleNodesData = [NSPrimitiveNodeData, NSArrayNodeData];
export const NSComplexNodesData = [
	NSIfNodeData,
	NSVarGetNodeData,
	NSVarSetNodeData,
	NSReturnNodeData,
	NSFunctionNodeData,
	NSFunctionRunNodeData
];
export const NSNodeData = [...NSSimpleNodesData, ...NSComplexNodesData];
export const NSSimpleNodeSchema = z.union(NSSimpleNodesData.map((n) => n.schema));

export const NSComplexNodeSchema = z.union(NSComplexNodesData.map((n) => n.schema));

export const NSNodeSchema = z.union([NSSimpleNodeSchema, NSComplexNodeSchema]);
export type NSNode = z.infer<typeof NSNodeSchema>;
