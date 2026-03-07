import type {
	NSFunctionCallNode,
	NSIfNode,
	NSNode,
	NSReturnNode,
	NSVarGetNode,
	NSVarSetNode
} from "./nodes";

export const $ = {
	return: (value: NSNode): NSReturnNode => ({ _nstype: "return", value }),
	if: (cond: NSNode, { yes, no }: { yes: NSNode; no: NSNode }): NSIfNode => ({
		_nstype: "if",
		if: cond,
		yes,
		no
	}),
	varSet: (id: NSNode, value: NSNode): NSVarSetNode => ({
		_nstype: "var-set",
		id,
		value
	}),
	varGet: (id: NSNode): NSVarGetNode => ({
		_nstype: "var-get",
		id
	}),
	fn: (id: NSNode, args: NSNode): NSFunctionCallNode => ({
		_nstype: "fn-call",
		id,
		args
	})
};
