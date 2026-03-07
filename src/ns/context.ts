import type { ZodType } from "zod";

export class RuntimeContext {
	constructor(
		public parent: RuntimeContext | null = null,
		public variables = new Map()
	) {}
	getVar(id: string): unknown {
		if (this.variables.has(id)) return this.variables.get(id) ?? null;
		return this.parent?.getVar(id) ?? null;
	}
	setVar(id: string, value: unknown) {
		this.variables.set(id, value);
	}
}

export class ScantimeContext {
	constructor(
		public parent: ScantimeContext | null = null,
		public types = new Map<string, ZodType>()
	) {}

	getType(id: string): ZodType | null {
		if (this.types.has(id)) return this.types.get(id) ?? null;
		return this.parent?.getType(id) ?? null;
	}

	setType(id: string, schema: ZodType) {
		this.types.set(id, schema);
	}
}
