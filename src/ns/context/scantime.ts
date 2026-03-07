import type { ZodType } from "zod";

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
		return null;
	}
}
