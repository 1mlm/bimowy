import type { NSNode } from "../nodes";
import type { NSFunctionNode } from "../nodes/code/fn-create";
import type { NSFunctionRunNode } from "../nodes/code/fn-run";
import type { NSGetFieldNode } from "../nodes/code/get-field";
import type { NSIfNode } from "../nodes/code/if";
import type { NSObjectNode } from "../nodes/code/object";
import type { NSReturnNode } from "../nodes/code/return";
import type { NSVarGetNode } from "../nodes/code/var-get";
import type { NSVarSetNode } from "../nodes/code/var-set";
import type { NSUIInputNode } from "../nodes/ui/input";
import type { NSUIViewNode } from "../nodes/ui/paragraph";
import type { NSUITextNode } from "../nodes/ui/text";
import type { NSUIWidgetNode } from "../nodes/ui/widget";

const rtrn = (value: NSNode): NSReturnNode => ({ _nstype: "return", value });

const cond = (condition: NSNode, yes: NSNode, no: NSNode): NSIfNode => ({
		_nstype: "if",
		condition,
		yes,
		no
	}),
	varSet = (id: NSNode, value: NSNode): NSVarSetNode => ({
		_nstype: "var-set",
		id,
		value
	}),
	varGet = (id: NSNode): NSVarGetNode => ({
		_nstype: "var-get",
		id
	}),
	getField = (object: NSNode, field: NSNode): NSGetFieldNode => ({
		_nstype: "get-field",
		object,
		field
	}),
	fnRun = (fn: NSNode, args: NSNode): NSFunctionRunNode => ({
		_nstype: "fn-run",
		fn,
		args
	}),
	fnNew = (inputs: NSNode, instructions: NSNode): NSFunctionNode => ({
		_nstype: "fn-create",
		inputs,
		instructions
	}),
	uiInput = (id: NSNode): NSUIInputNode => ({
		_nstype: "ui-input",
		id
	}),
	uiText = (text: NSNode): NSUITextNode => ({
		_nstype: "ui-text",
		text
	}),
	uiParagraph = (items: NSNode): NSUIViewNode => ({
		_nstype: "ui-prgh",
		items
	}),
	uiWidget = (id: NSNode, args: NSNode): NSUIWidgetNode => ({
		_nstype: "ui-widget",
		id,
		args
	}),
	newObj = (props: Record<string, NSNode>): NSObjectNode => ({
		_nstype: "object",
		props
	}),
	fnNewNReturn = (value: NSNode): NSFunctionNode => fnNew([], [rtrn(value)]),
	fnNewNRun = (instructions: NSNode): NSFunctionRunNode => fnRun(fnNew([], instructions), []),
	fnGetNRun = (id: string, args: NSNode): NSFunctionRunNode => fnRun(varGet(id), args),
	fnSet = (id: NSNode, inputs: NSNode, instructions: NSNode): NSVarSetNode =>
		varSet(id, fnNew(inputs, instructions));

export const $ns = {
	rtrn,
	cond,
	var: {
		set: varSet,
		get: varGet
	},
	fn: {
		run: fnRun,
		newNReturn: fnNewNReturn,
		newNRun: fnNewNRun,
		getNRun: fnGetNRun,
		new: fnNew,
		set: fnSet
	},
	obj: {
		getField,
		new: newObj
	},
	ui: {
		input: uiInput,
		text: uiText,
		prgh: uiParagraph,
		widget: uiWidget
	}
};
