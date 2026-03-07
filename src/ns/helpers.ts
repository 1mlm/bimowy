import type { NSNode } from "./nodes";
import type { NSFunctionRunNode } from "./nodes/fn-run";
import type { NSIfNode } from "./nodes/if";
import type { NSReturnNode } from "./nodes/return";
import type { NSVarGetNode } from "./nodes/var-get";
import type { NSVarSetNode } from "./nodes/var-set";

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
	fnRun: (id: NSNode, args: NSNode): NSFunctionRunNode => ({
		_nstype: "fn-run",
		id,
		args
	}),
	fnCreate: (id: NSNode, args: NSNode) => ({
		_nstype: "fn-create",
		id,
		args
	})
};
