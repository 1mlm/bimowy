import type { NSNode } from "./nodes";
import type { NSFunctionNode } from "./nodes/code/fn-create";
import type { NSFunctionRunNode } from "./nodes/code/fn-run";
import type { NSIfNode } from "./nodes/code/if";
import type { NSReturnNode } from "./nodes/code/return";
import type { NSVarGetNode } from "./nodes/code/var-get";
import type { NSVarSetNode } from "./nodes/code/var-set";

const rtrn = (value: NSNode): NSReturnNode => ({ _nstype: "return", value });

const cond = (cond: NSNode, yes: NSNode, no: NSNode): NSIfNode => ({
	_nstype: "if",
	if: cond,
	yes,
	no
});
const varSet = (id: NSNode, value: NSNode): NSVarSetNode => ({
	_nstype: "var-set",
	id,
	value
});
const varGet = (id: NSNode): NSVarGetNode => ({
	_nstype: "var-get",
	id
});
const fnRun = (fn: NSNode, args: NSNode): NSFunctionRunNode => ({
	_nstype: "fn-run",
	fn,
	args
});
const basicFnRun = (id: string, args: NSNode): NSFunctionRunNode => fnRun(varGet(id), args);
const fnCreate = (inputs: NSNode, instructions: NSNode): NSFunctionNode => ({
	_nstype: "fn-create",
	inputs,
	instructions
});
const fnSet = (id: NSNode, inputs: NSNode, instructions: NSNode): NSVarSetNode =>
	varSet(id, fnCreate(inputs, instructions));

export const $ns = { rtrn, cond, varSet, varGet, fnRun, basicFnRun, fnCreate, fnSet };
